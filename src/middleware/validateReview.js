export function validateReview(req, res, next) {
  const {
    title,
    content,
    reviewPoint,
    bookId
  } = req.body;

  if (req.method === 'POST') {
    if (!bookId) {
      return res.status(400).json({
        message: 'Book ID is required.'
      });
    }
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        message: 'Title is required and must be a non-empty string.'
      });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({
        message: 'Content is required and must be a non-empty string.'
      });
    }
    if (reviewPoint === undefined || typeof reviewPoint !== 'number' || reviewPoint < 1 || reviewPoint > 5) {
      return res.status(400).json({
        message: 'Review point is required and must be an integer between 1 and 5.'
      });
    }
  } else if (req.method === 'PUT') {
    const updates = req.body;
    const allowedUpdates = ['title', 'content', 'reviewPoint'];
    const isValidOperation = Object.keys(updates).every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({
        message: 'Invalid updates provided!'
      });
    }

    if (updates.reviewPoint !== undefined && (typeof updates.reviewPoint !== 'number' || updates.reviewPoint < 1 || updates.reviewPoint > 5)) {
      return res.status(400).json({
        message: 'Review point must be an integer between 1 and 5.'
      });
    }
  }

  next();
}