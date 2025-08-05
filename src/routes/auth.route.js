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
import { tr } from "@faker-js/faker";

const authRoute = express.Router();

///////////////// สำหรับการ login ด้วย Google /////////////////////////

// หน้าเทสสำหรับการ login ด้วย Google
authRoute.get("/", (req, res) => {
  res.send(`
    <div style="padding: 20px; font-family: Arial;">
      <h2>Authentication Test</h2>
      <a href='/api/auth/google' style="
        background: #4285f4; 
        color: white; 
        padding: 10px 20px; 
        text-decoration: none; 
        border-radius: 5px;
        display: inline-block;
      ">Login with Google</a>
    </div>
  `);
});

// ไปหน้า login ด้วย Google กดอนุญาต

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// จะถูก redirect กลับมาที่ /api/auth/google/callback
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    // Google ส่ง authorization code มา ตัว Passport.js จะ:
    // 1. แลก code เป็น access token กับตัว Google
    // 2. ใช้ access token ดึงข้อมูล user จาก Google API
    // 3. เรียก GoogleStrategy callback function (อยู่ใน passport.config.js)
    // 4. ใส่ข้อมูล user ใน req.user
    failureRedirect: "/api/auth?error=auth_failed", // ถ้า auth ล้มเหลวมาเส้นนี้
    session: false, // เราใช้ jwt ถ้าใช้ session จะเขียนอีกแบบนึง
  }),
  (req, res) => {
    // ดูข้อมูล user ที่ได้จาก Google
    console.log("Google User Data:", req.user);
    try {
      if (!req.user) {
        // ถ้าไม่่มีข้อมูลจาก Google แสดงว่า passport authentication ล้มเหลว
        return res.redirect("/api/auth?error=no_user_data");
      }

      // สร้าง JWT token เพื่อส่งกลับไปยัง frontend ใช้ authenticate
      const token = jwt.sign(
        {
          // payload ที่จะเก็บใน token
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role || "USER",
          },
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h", algorithm: "HS256" }
      );

      // ส่ง user กลับไป frontend พร้อม token ใน URL parameter
      const frontendURL = process.env.URL || "http://localhost:5173";
      // ตัวอย่าง URL ที่จะ redirect ไปยัง frontend
      // http://localhost:5173/auth/callback?token=eyJhbGciOiJI...
      res.redirect(`${frontendURL}/auth/callback?token=${token}`);
      console.log("Token:", token);
      // user ถูกส่งไปยัง frontend แล้ว
      // frontend จะต้องมีหน้า /auth/callback เพื่อรับ token นี้
    } catch (error) {
      console.error(error);
      res.redirect(`${frontendURL}/auth/error?message=token_failed`);
    }
  }
);

////////////////////////////////////////////////////////////
passport.authenticate(
  "google",
  { failureRedirect: "/api/auth" },
  (req, res) => {
    res.redirect("http://localhost:6500/api/auth/test");
  }
);
authRoute.get("/test", (req, res) => {
  res.send(req.user.displayName + " is logged in");
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
authRoute.get("/verification/:token", authController.verification);
authRoute.delete("/:id", authController.deleteUser); // for quick test register and send node mailer
authRoute.get("/refresh", authController.refreshToken); // for refresh token

export default authRoute;
