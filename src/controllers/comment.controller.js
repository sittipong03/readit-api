import {getAllCommentsService, deleteCommentService} from "../services/comment.service.js"

export async function getAll(req, res) {
  const {
    reviewId
  } = req.params;
  try {
    const comments = await getAllCommentsService(reviewId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      message: 'Failed to fetch comments.'
    });
  }
}

export async function deleteComment(req, res) {
  const {
    id
  } = req.params;
  const userId = req.user.id;

  try {
    const result = await deleteCommentService(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Comment not found.') {
      return res.status(404).json({
        message: error.message
      });
    }
    if (error.message === 'Unauthorized: You can only delete your own comments.') {
      return res.status(403).json({
        message: error.message
      });
    }
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      message: 'Failed to delete comment.'
    });
  }
}