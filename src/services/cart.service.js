import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function testGetCart() {
  return await prisma.user.findMany();
}

export async function getCart(userId) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          addedAt: "asc",
        },
      },
    },
  });

  // ถ้า user ตะกร้า ให้สร้างตะกร้าใหม่
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
        items: {},
      },
    });
  }
  return cart;
}

export async function addToCart(userId, productId, quantity) {
  // 1. ค้นหาตะกร้าของผู้ใช้ก่อน
  let cart = await prisma.cart.findUnique({
    where: { userId: userId },
  });

  // 2. ถ้าไม่เจอ (ผู้ใช้ยังไม่มีตะกร้า) ให้ "insert" (create) ตะกร้าใหม่
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }

  // 3. เช็คว่ามีสินค้านี้ในตะกร้าแล้วหรือยัง
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: productId,
    },
  });

  if (existingItem) {
    // 4. ถ้ามีอยู่แล้ว ให้อัปเดตจำนวน
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // 5. ถ้ายังไม่มี ให้เพิ่มรายการใหม่
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });
  }

  // 6. คืนค่าตะกร้าที่อัปเดตแล้ว
  return getCart(userId);
}

export async function updateCartItemQuantity(userId, itemId, quantity) {
  //เช็คว่าจำนวนถูกต้องมั้ย
  if (quantity <= 0) {
    //ถ้าเป็น 0 หรือน้อยกว่า ให้ลบ
    return removeCartItem(userId, itemId);
  }
  //ค้นหาสินค้าในตะกร้า
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    createError(403, "คุณไม่มีสิทธิ์แก้ไขรายการสินค้านี้");
  }

  //อัพเดท

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: quantity },
  });
  return updatedItem;
}

export async function removeCartItem(userId, itemId) {
  //
  const cartItem = await prisma.cartItem.findUnique({
    //หาสินคเาในตะกร้า
    where: { id: itemId },
    include: { cart: true },
  });

  //ตรวจสอบว่ารายการสินค้านี้เป็นของผู้ใช้ที่ส่ง request มาจริงมั้ย
  if (!cartItem || cartItem.cart.userId !== userId) {
    throw createError(403, "ไม่พบรายการสินค้า");
  }

  //ทำการลบ
  await prisma.cartItem.delete({
    where: { id: itemId },
  });
  return { message: "ลบสินค้าออกจากตะกร้าสำเร็จ" };
}
