import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const cartRoute = express.Router();

// cartRoute.get("/", cartController.testGet);
cartRoute.get("/", authMiddleware, cartController.getCart);
cartRoute.post("/", authMiddleware, cartController.addToCart);
cartRoute.patch(
  "/:itemId",
  authMiddleware,
  cartController.updateCartItemQuantity
);
cartRoute.delete("/:itemId", authMiddleware, cartController.removeCartItem);

export default cartRoute;
