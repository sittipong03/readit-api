import express from "express";
import * as followerController from "../controllers/follower.controller.js";

const followerRoute = express.Router();

followerRoute.post("/follow", followerController.followUser);
followerRoute.delete("/unfollow", followerController.unfollowUser);

export default followerRoute;
