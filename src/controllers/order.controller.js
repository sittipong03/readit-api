import createError from "../utils/create-error.util.js";
import * as orderService from "../services/order.service.js";

export async function testGet(req, res, next) {
  try {
    const data = await orderService.testGetOrder();
    res.json({ data, message: "Order" });
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req, res, next) {
  try {
    // const userId = req.user.id; รอLogin
    const { userId, addressId, affiliateCode } = req.body;

    if (!addressId) {
      return next(createError(400, "กรุณาระบุที่อยู่สำหรับจัดส่ง"));
    }

    const order = await orderService.createOrder(
      userId,
      addressId,
      affiliateCode
    );
    res.status(201).json({ message: "สร้างออเดอร์สำเร็จ", order });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    res.json({ order });
  } catch (error) {
    next(error);
  }
}
