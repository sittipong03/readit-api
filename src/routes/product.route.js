import express from "express";
import * as productController from "../controllers/product.controller.js";
// import { adminMiddleware } from '../middlewares/admin.middleware.js'; // ตัวอย่าง Middleware

const productRoute = express.Router();

// --- Product Routes ---

productRoute.get("/by-book/:bookId", productController.getProductByBookId);

productRoute.post("/", /* adminMiddleware, */ productController.createProduct);

productRoute.get("/", productController.getAllProducts);

productRoute.get("/:id", productController.getProductById);

productRoute.patch("/:id", /* adminMiddleware, */ productController.updateProduct);

productRoute.delete("/:id", /* adminMiddleware, */ productController.deleteProduct);

export default productRoute;