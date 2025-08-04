import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function testGetOrder() {
  return await prisma.user.findMany();
}

export async function createOrder(userId, addressId, affiliateCode) {
  // 1. ดึง cart กับสินค้า
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw createError(400, "ไม่พบสินค้าในตระกร้า");
  }

  // 2. ดึง userAddress จาก addressId
  const userAddress = await prisma.userAddress.findUnique({
    where: { id: addressId },
  });

  if (!userAddress) {
    throw createError(400, "ที่อยู่ไม่ถูกต้อง");
  }

  // 3. ตรวจ ownership (ป้องกันใช้ address ของคนอื่น)
  if (userAddress.userId !== userId) {
    throw createError(403, "ที่อยู่นี้ไม่ใช่ของผู้ใช้คนนี้");
  }

  // 4. คำนวณ totalAmount ทางฝั่งเซิร์ฟเวอร์เท่านั้น
  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  // 5. สร้าง order ภายใน transaction
  const newOrder = await prisma.$transaction(async (tx) => {
    // หา affiliate ก่อน เพื่อจะใช้ affiliate.id ใน order ถ้า valid
    let affiliateRecord = null;
    if (affiliateCode) {
      affiliateRecord = await tx.affiliate.findUnique({
        where: { affiliateCode },
      });
      // ถ้า self-referral ให้ยกเลิก (ไม่ใส่ affiliate และไม่ให้คอมมิชชั่น)
      if (affiliateRecord && affiliateRecord.userId === userId) {
        affiliateRecord = null;
      }
    }

    const order = await tx.order.create({
      data: {
        userId,
        // ไม่มี addressId ตาม schema — snapshot ข้อมูล
        name: userAddress.receiverName,
        address: userAddress.address,
        phoneNumber: userAddress.phoneNumber || "",
        totalAmount,
        isAffiliate: !!affiliateRecord,
        affiliateId: affiliateRecord ? affiliateRecord.id : null,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 6. สร้าง commission ถ้ามี affiliate valid (และไม่ self-referral)
    if (affiliateRecord) {
      await tx.commission.create({
        data: {
          orderId: order.id,
          affiliateId: affiliateRecord.id,
          commissionAmount: totalAmount * 0.1,
        },
      });
    }

    // 7. เคลียร์ cart items
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

  return newOrder;
}

export const getOrdersByUserId = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId: userId },
    include: {
      // ดึงข้อมูลสินค้าในแต่ละออเดอร์มาด้วย
      items: {
        include: {
          product: {
            include: {
              // ดึงข้อมูลหนังสือที่ผูกกับสินค้า
              book: {
                include: {
                  // ดึงข้อมูล edition ที่เป็นเล่มล่าสุดเพื่อเอาปกหนังสือ
                  edition: {
                    where: { isLatest: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc", // เรียงจากใหม่ไปเก่า
    },
  });
  return orders;
};

export async function getOrderDetail(orderId, userId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              book: {
                include: {
                  edition: true, // เอา coverImage จาก latest หรือ index 0
                  Author: true,
                },
              },
            },
          },
        },
      },
      commissions: true,
      payment: true,
      affiliate: true,
      user: {
        include: {
          userAddress: true, // อาจไม่จำเป็นเพราะ snapshot อยู่ใน order
        },
      },
    },
  });

  if (!order) {
    throw createError(404, "Order not found");
  }

  // ความปลอดภัย: ถ้าไม่ใช่ admin ให้เช็ค ownership
  if (order.userId !== userId) {
    console.log("Ownership mismatch", {
      orderUserId: order.userId,
      requester: userId,
    });
    throw createError(403, "Forbidden");
  }

  return order;
}
