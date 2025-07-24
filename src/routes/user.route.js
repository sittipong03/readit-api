import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isOwnerOrAdmin } from "../middleware/isOwnerOrAdmin.js";

const userRoute = express.Router();

// userRoute.get("/", userController.testGet);
userRoute.get("/:id", authMiddleware, userController.getMe);
userRoute.put("/:id", authMiddleware, userController.updateUser);
userRoute.delete(
  "/:id",
  authMiddleware,
  isOwnerOrAdmin,
  userController.deleteUser
);

export default userRoute;
