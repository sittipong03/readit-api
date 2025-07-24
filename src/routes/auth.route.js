import express from "express";
import * as authController from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";

const authRoute = express.Router();

authRoute.get("/", authController.testGetUser);

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
