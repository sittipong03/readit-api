import express from "express";
import passport from "../config/passport.config.js";
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
import { auth } from "google-auth-library";

const authRoute = express.Router();

// สำหรับทดสอบการ login ด้วย Google
authRoute.get("/", (req, res) => {
  res.send("<a href='/api/auth/google'>Login with Google</a>");
});
authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth",
    session: false,
  }),
  (req, res) => {
    try {
      // สร้าง JWT token
      const token = jwt.sign(
        {
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role || "USER",
          },
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );

      // ส่ง token ไปกับ redirect (สำหรับ testing)
      res.redirect(`http://localhost:6500/api/auth/test?token=${token}`);
    } catch (error) {
      console.error("Token creation error:", error);
      res.redirect("/api/auth?error=token_failed");
    }
  }
);
//////////
authRoute.get("/test", authMiddleware, (req, res) => {
  // ต้องใช้ middleware เพื่อตรวจสอบ authentication
  res.json({
    message: `${req.user.name} is logged in`,
    user: req.user,
  });
});

authRoute.get("/logout", (req, res) => {
  res.logout();
  res.redirect("http://localhost:6500/api/auth");
});

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
