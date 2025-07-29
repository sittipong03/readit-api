import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  validate,
  validateEmail,
  validateLogin,
  validateRegister,
  validateResetToken,
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
authRoute.post(
  "/reset",
  authMiddleware,
  validate(validateResetToken),
  authController.resetPassword
);

//เทส
authRoute.post("/get-test-token", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("กรุณาส่ง userId มาด้วย");
  }

  // สร้าง Token ให้กับ userId ที่ส่งมา
  const token = jwt.sign({ id: userId }, "YOUR_JWT_SECRET", {
    expiresIn: "1d",
  });

  console.log(`--- สร้าง Token สำหรับทดสอบให้ userId: ${userId} ---`);
  res.json({
    message: "นี่คือ Token สำหรับทดสอบเท่านั้น!",
    token: token,
  });
});
export default authRoute;
