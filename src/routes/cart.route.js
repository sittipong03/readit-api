import express from "express";
import * as cartController from "../controllers/cart.controller.js";

const cartRoute = express.Router();

// cartRoute.get("/", cartController.testGet);
cartRoute.get("/:userId", cartController.getCart); //จริงต้อง "/" แต่รอ login
cartRoute.post("/", cartController.addToCart);
cartRoute.patch("/:itemId", cartController.updateCartItemQuantity);
cartRoute.delete("/:itemId", cartController.removeCartItem);

export default cartRoute;
