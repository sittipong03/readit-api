import express from "express";
import * as reviewController from "../controllers/review.controller.js";

const reviewRoute = express.Router();

reviewRoute.get("/", reviewController.testGet);

export default reviewRoute;
