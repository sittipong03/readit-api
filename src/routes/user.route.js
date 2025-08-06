import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isOwnerOrAdmin } from "../middleware/isOwnerOrAdmin.js";

const userRoute = express.Router();

userRoute.get('/booktag-preference-check', authMiddleware, userController.checkBookTagPreference);
userRoute.post('/booktag-preference', authMiddleware, userController.saveBookTagPreferences );

// userRoute.get("/", userController.testGet);
userRoute.get("/:id", authMiddleware, userController.getMe);
userRoute.put("/:id", authMiddleware, userController.updateUser);
userRoute.delete(
  "/:id",
  authMiddleware,
  isOwnerOrAdmin,
  userController.deleteUser
);
userRoute.patch(
  "/:id/profile",
  authMiddleware,
  userController.updateUserProfile
);

userRoute.patch("/:id/password", authMiddleware, userController.updatePassword);
userRoute.delete("/", authMiddleware, userController.deleteCurrentUser);
userRoute.patch("/avatar", authMiddleware, userController.updateAvatar);


export default userRoute;
