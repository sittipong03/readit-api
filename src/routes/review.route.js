import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import {
  authMiddleware,
  isReviewOwner,
} from "../middleware/auth.middleware.js";
import {
  validateReview,
  validateReviewId,
} from "../middleware/validateReview.js";

const reviewRoute = express.Router();

reviewRoute.get("/", reviewController.testGet);

// Moderation route
reviewRoute.post("/moderate-review", reviewController.moderateReviewController);

reviewRoute.post(
  "/:bookId",
  authMiddleware,
  validateReview,
  reviewController.createReview
);

reviewRoute.get("/:bookId", reviewController.getReviewsByBook);
reviewRoute.put(
  "/:id",
  authMiddleware,
  isReviewOwner,
  validateReview,
  reviewController.editReview
);
reviewRoute.delete(
  "/:id",
  authMiddleware,
  isReviewOwner,
  reviewController.deleteReview
);

export default reviewRoute;
