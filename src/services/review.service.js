import prisma from "../config/prisma.config.js";
import { updateReviewCounts } from "../utils/updateCounts.util.js";

export async function createReviewService(userId, bookId, title, content) {
  // Check if user already submitted a review
  console.log("createReviewService userId:");
  console.log(userId);
  const existing = await prisma.review.findFirst({
    where: {
      userId,
      bookId,
    },
  });

  if (existing) {
    throw new Error("You have already submitted a review for this book.");
  }

  // Create the review
  const review = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: { userId, bookId, title, content },
    });

    // ใช้ utility function เพื่ออัปเดต counts
    await updateReviewCounts(tx, { bookId, userId, operation: "increment" });

    return newReview;
  });

  return review;
}

export async function getReviewsByBookService(bookId) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        bookId: bookId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reviews;
  } catch (error) {
    throw error;
  }
}

export async function editReviewService(reviewId, userId, updateData) {
  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      throw new Error("Review not found.");
    }

    if (existingReview.userId !== userId) {
      throw new Error("Unauthorized: You can only edit your own reviews.");
    }
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
    });
    return updatedReview;
  } catch (error) {
    throw error;
  }
}
export async function deleteReviewService(reviewId, userId) {
  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      throw new Error("Review not found.");
    }

    if (existingReview.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own reviews.");
    }

    await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id: reviewId } });
    await updateReviewCounts(tx, { 
      bookId: existingReview.bookId, 
      userId, 
      operation: 'decrement' 
    });
  });

    return { message: "Review deleted successfully." };
  } catch (error) {
    throw error;
  }
}
