import express from "express";
// import passport from "../config/passport.config.js";
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

authRoute.get("/", (req, res) => {
  res.send("<a href='/api/auth/google'>Login with Google</a>");
});
// authRoute.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// authRoute.get(
//   "/google/callback",
//   passport.authenticate(
//     "google",
//     { failureRedirect: "/api/auth" },
//     (req, res) => {
//       res.redirect("http://localhost:6500/api/auth/test");
//     }
//   )
// );
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
authRoute.get("/verification/:token" , authController.verification)
authRoute.delete("/:id" , authController.deleteUser) // for quick test register and send node mailer


export default authRoute;
