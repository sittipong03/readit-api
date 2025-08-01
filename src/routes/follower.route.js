import express from "express";
import * as followerController from "../controllers/follower.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followerRoute = express.Router();

followerRoute.post("/follow", authMiddleware, followerController.followUser);
followerRoute.delete(
  "/unfollow",
  authMiddleware,
  followerController.unfollowUser
);

export default followerRoute;
