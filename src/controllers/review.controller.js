import createError from "../utils/create-error.util.js"
import * as reviewService from "../services/review.service.js"

export async function createReview(req, res) {
  const {
    bookId
  } = req.params;
  const {
    title,
    content,
    reviewPoint
  } = req.body;
  const userId = req.user.id;

  try {
    const review = await reviewService.createReviewService(userId, bookId, title, content, reviewPoint);
    return res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    if (error.message === 'Review point must be between 1 and 5.') {
      return res.status(400).json({
        message: error.message
      });
    }
    if (error.message === 'You have already submitted a review for this book.') {
      return res.status(409).json({
        message: error.message
      });
    }
    console.error('Error creating review:', error);
    return res.status(500).json({
      message: 'Failed to add review.'
    });
  }
}

export async function getReviewsByBook(req, res) {
  const {
    bookId
  } = req.params;
  try {
    const reviews = await reviewService.getReviewsByBookService(bookId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      message: 'Failed to fetch reviews.'
    });
  }
}

export async function editReview(req, res) {
  const {
    id
  } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const updatedReview = await reviewService.editReviewService(id, userId, updateData);
    return res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    if (error.message === 'Review not found.') {
      return res.status(404).json({
        message: error.message
      });
    }
    if (error.message === 'Unauthorized: You can only edit your own reviews.') {
      return res.status(403).json({
        message: error.message
      });
    }
    console.error('Error editing review:', error);
    return res.status(500).json({
      message: 'Failed to update review.'
    });
  }
}

export async function deleteReview(req, res) {
  const {
    id
  } = req.params;
  const userId = req.user.id;

  try {
    const result = await reviewService.deleteReviewService(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Review not found.') {
      return res.status(404).json({
        message: error.message
      });
    }
    if (error.message === 'Unauthorized: You can only delete your own reviews.') {
      return res.status(403).json({
        message: error.message
      });
    }
    console.error('Error deleting review:', error);
    return res.status(500).json({
      message: 'Failed to delete review.'
    });
  }
}