import express from "express";
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const orderRoute = express.Router();

// orderRoute.get("/", orderController.testGet);
orderRoute.post("/", authMiddleware, orderController.createOrder);
orderRoute.get("/:id", authMiddleware, orderController.getOrderById);

export default orderRoute;
