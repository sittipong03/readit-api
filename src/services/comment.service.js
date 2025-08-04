import prisma from "../config/prisma.config.js";

export async function getAllCommentsService(reviewId) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        reviewId: reviewId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return comments;
  } catch (error) {
    throw error;
  }
}

export async function deleteCommentService(commentId, userId) {
  try {
    const existingComment = await prisma.comment.findUnique({
      where: {
        id: commentId
      },
    });

    if (!existingComment) {
      throw new Error('Comment not found.');
    }

    if (existingComment.userId !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments.');
    }

    await prisma.comment.delete({
      where: {
        id: commentId
      }
    });
    return {
      message: 'Comment deleted successfully.'
    };
  } catch (error) {
    throw error;
  }
}