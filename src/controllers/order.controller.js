import createError from "../utils/create-error.util.js";
import * as orderService from "../services/order.service.js";

// export async function testGet(req, res, next) {
//   try {
//     const data = await orderService.testGetOrder();
//     res.json({ data, message: "Order" });
//   } catch (error) {
//     next(error);
//   }
// }

export async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const { addressId, affiliateCode } = req.body;

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

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id; // ดึง ID จาก token
    const orders = await orderService.getOrdersByUserId(userId);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export async function getOrderDetailController(req, res, next) {
  try {
    console.log("Entered getOrderDetailController, user:", req.user);
    const orderId = req.params.id;
    const userId = req.user.id; // จาก auth middleware
    const order = await orderService.getOrderDetail(orderId, userId);
    res.json({ order });
  } catch (err) {
    console.log("getOrderDetailController error:", err);
    next(err);
  }
}
