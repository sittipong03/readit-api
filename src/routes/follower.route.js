import express from "express";
import * as followerController from "../controllers/follower.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const followerRoute = express.Router();


followerRoute.get("/:userId/is-following", authMiddleware, followerController.isfollowing);
followerRoute.post("/:userId/follow", authMiddleware, followerController.followUser);
followerRoute.delete("/:userId/unfollow",authMiddleware,followerController.unfollowUser);

export default followerRoute;
