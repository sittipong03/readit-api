import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const notificationRoute = express.Router();

notificationRoute.get(
  "/:userId",
  authMiddleware,
  notificationController.getAllNotifications
);

export default notificationRoute;
