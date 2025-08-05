import createError from "../utils/create-error.util.js";
import * as cartService from "../services/cart.service.js";

export async function getCart(req, res, next) {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    res.json({ cart });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    // const userId = req.user.id;

    const { productId, quantity, userId } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      throw createError(400, "กรุณาระบุ productId และ quantity ให้ถูกต้อง");
    }
    const updatedCart = await cartService.addToCart(
      userId,
      productId,
      quantity
    );
    res
      .status(200)
      .json({ message: "เพิ่มสินค้าลงตะกร้าสำเร็จ", cart: updatedCart });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItemQuantity(req, res, next) {
  try {
    const userId = req.user.id;
    // const { itemId } = req.params;
    const { quantity, itemId } = req.body;

    if (typeof quantity === "undefined") {
      throw createError(400, "กรุณาระบุ quantity");
    }

    const updatedItem = await cartService.updateCartItemQuantity(
      userId,
      itemId,
      quantity
    );

    res.json({ message: "อัพเดทจำนวนสินค้าสำเร็จ", item: updatedItem });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const userId = req.user.id;

    const { itemId } = req.params;

    if (!userId) {
      throw createError(400, "กรุณาส่ง userId มาใน Body");
    }

    const result = await cartService.removeCartItem(userId, itemId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
