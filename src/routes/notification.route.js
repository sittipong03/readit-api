import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isOwner } from "../middleware/isOwner.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/:userId",
  authMiddleware,
  isOwner,
  notificationController.getAllNotifications
);

export default notificationRoute;
