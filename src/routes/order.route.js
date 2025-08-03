import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const orderRoute = express.Router();

// orderRoute.get("/", orderController.testGet);
orderRoute.post("/", authMiddleware, orderController.createOrder);
orderRoute.get("/", authMiddleware, orderController.getMyOrders);
orderRoute.get(
  "/:id",
  authMiddleware,
  orderController.getOrderDetailController
);

export default orderRoute;
