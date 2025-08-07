import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function getCart(userId) {
  console.log("Service: Getting cart for user ID:", userId);

  // 1. ค้นหาตะกร้าจาก `userId` ซึ่งเป็น unique foreign key
  let cart = await prisma.cart.findUnique({
    where: { userId: userId }, // <<< FIX: ค้นหาด้วย userId ไม่ใช่ id
    include: {
      items: {
        include: {
          product: true, // ดึงข้อมูลสินค้ามาด้วย
        },
        orderBy: {
          addedAt: "asc",
        },
      },
    },
  });

  // 2. ถ้าไม่เจอตะกร้า ให้สร้างใหม่
  if (!cart) {
    console.log(`Cart not found for user ${userId}. Creating a new one.`);
    cart = await prisma.cart.create({
      data: {
        // <<< FIX: ใช้ "connect" เพื่อสร้างความสัมพันธ์กับ User ที่มีอยู่แล้ว
        user: {
          connect: {
            id: userId,
          },
        },
      },
      // include ข้อมูลหลังจากสร้างเสร็จ เพื่อให้ได้ format เดียวกัน
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  return cart;
}

/**
 * เพิ่มสินค้าลงในตะกร้า หรืออัปเดตจำนวนถ้ามีอยู่แล้ว
 * @param {string} userId - ไอดีของผู้ใช้
 * @param {string} productId - ไอดีของสินค้า
 * @param {number} quantity - จำนวนสินค้าที่ต้องการเพิ่ม
 * @returns {Promise<object>} ข้อมูลตะกร้าล่าสุด
 */
export async function addToCart(userId, productId, quantity) {
  // 1. ใช้ getCart เพื่อให้แน่ใจว่าผู้ใช้มีตะกร้าแล้ว (ถ้าไม่มีจะสร้างให้)
  const cart = await getCart(userId);

  // 2. เช็คว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  if (existingItem) {
    // 3. ถ้ามีอยู่แล้ว ให้อัปเดตจำนวน (ใช้ increment เพื่อความปลอดภัย)
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } },
    });
  } else {
    // 4. ถ้ายังไม่มี ให้เพิ่มรายการใหม่
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });
  }

  // 5. คืนค่าตะกร้าที่อัปเดตแล้วทั้งหมด
  return getCart(userId);
}

/**
 * อัปเดตจำนวนของสินค้าชิ้นเดียวในตะกร้า
 * @param {string} userId - ไอดีของผู้ใช้
 * @param {string} itemId - ไอดีของ CartItem (ไม่ใช่ Product ID)
 * @param {number} quantity - จำนวนใหม่
 * @returns {Promise<object>} ข้อมูล CartItem ที่อัปเดตแล้ว
 */
export async function updateCartItemQuantity(userId, itemId, quantity) {
  // ถ้าจำนวนใหม่เป็น 0 หรือน้อยกว่า ให้ลบสินค้านั้นออกจากตะกร้า
  if (quantity <= 0) {
    return removeCartItem(userId, itemId);
  }

  // ค้นหาสินค้าในตะกร้า พร้อมทั้งเช็คว่าเป็นของ user คนนี้จริงหรือไม่
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: userId,
      },
    },
  });

  if (!cartItem) {
    throw createError(404, "ไม่พบรายการสินค้าในตะกร้าของคุณ หรือคุณไม่มีสิทธิ์แก้ไข");
  }

  // อัปเดตจำนวน
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: quantity },
  });
}

/**
 * ลบสินค้าออกจากตะกร้า
 * @param {string} userId - ไอดีของผู้ใช้
 * @param {string} itemId - ไอดีของ CartItem
 * @returns {Promise<{message: string}>} ข้อความยืนยันการลบ
 */
export async function removeCartItem(userId, itemId) {
  // ตรวจสอบว่ารายการสินค้านี้เป็นของผู้ใช้ที่ส่ง request มาจริงหรือไม่
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: {
        userId: userId,
      },
    },
  });

  if (!cartItem) {
    throw createError(404, "ไม่พบรายการสินค้าในตะกร้าของคุณ");
  }

  // ทำการลบ
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return { message: "ลบสินค้าออกจากตะกร้าสำเร็จ" };
}
