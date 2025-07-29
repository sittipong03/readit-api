import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function testGetOrder() {
  return await prisma.user.findMany();
}

export async function createOrder(userId, addressId, affiliateCode) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    createError(400, "ไม่พบสินค้าในตระกร้า");
  }

  const totalAmount = cart.items.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0);

  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: userId,
        addressId: addressId,
        totalAmount: totalAmount,
        isAffiliate: !!affiliateCode,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.product.price,
          })),
        },
      },
    });

    if (affiliateCode) {
      const affiliate = await tx.affiliate.findUnique({
        where: { affiliateCode: affiliateCode },
      });
      if (affiliate && affiliate.userId !== userId) {
        await tx.commission.create({
          data: {
            orderId: order.id,
            affiliateId: affiliate.id,
            commissionAmount: totalAmount * 0.05,
          },
        });
      }
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return order;
  });
  return newOrder;
}

export async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { include: { book: true } },
        },
      },
      address: true,
      commissions: { include: { affiliate: true } },
    },
  });
  if (!order) {
    createError(404, "ไม่พบออเดอร์นี้");
  }
  return order;
}
