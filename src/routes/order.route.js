import express from "express";
import * as orderController from "../controllers/order.controller.js";

const orderRoute = express.Router();

orderRoute.get("/", orderController.testGet);
orderRoute.post("/", orderController.createOrder);
orderRoute.get("/:id", orderController.getOrderById);

export default orderRoute;
