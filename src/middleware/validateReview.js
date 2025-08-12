import createError from "../utils/create-error.util.js";

export function validateReview(req, res, next) {
  const { title, content } = req.body;
  const { bookId } = req.params;

  if (req.method === "POST") {
    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required.",
      });
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string.",
      });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({
        message: "Content is required and must be a non-empty string.",
      });
    }
  } else if (req.method === "PUT") {
    const updates = req.body;
    const allowedUpdates = ["title", "content"];
    const isValidOperation = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidOperation) {
      return res.status(400).json({
        message: "Invalid updates provided!",
      });
    }
  }

  next();
}

export const validateReviewId = (req, res, next) => {
  const { reviewId } = req.params;
  if (!reviewId) {
    return createError(400, "Review ID is required");
  }
  next();
};
