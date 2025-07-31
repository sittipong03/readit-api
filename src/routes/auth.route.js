import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validate,
  validateEmail,
  validateLogin,
  validateRegister,
} from "../middleware/validator.js";
import jwt from "jsonwebtoken";

const authRoute = express.Router();

authRoute.get("/", authController.testGetUser);
authRoute.post(
  "/register",
  validate(validateRegister),
  authController.register
);
authRoute.post("/login", validate(validateLogin), authController.login);
authRoute.post("/logout", authMiddleware, authController.logout);
authRoute.get("/me", authMiddleware, authController.getMe);
authRoute.post(
  "/forgot",
  validate(validateEmail),
  authController.forgotPassword
);
authRoute.post("/reset", authController.resetPassword);

export default authRoute;
