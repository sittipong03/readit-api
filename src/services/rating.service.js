import prisma from "../config/prisma.config.js";

export async function rateBookService(userId, bookId, rating) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5.');
  }

  try {
    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      },
    });
    const book = await prisma.book.findUnique({
      where: {
        id: bookId
      },
      select: {
        ratingCount: true,
        averageRating: true,
      },
    });
    if (!book) {
      throw new Error('Book not found.');
    }
    let updatedRating;
    let newAverageRating;
    let newRatingCount = book.ratingCount;
    if (existingRating) {
      updatedRating = await prisma.rating.update({
        where: {
          id: existingRating.id
        },
        data: {
          rating: rating
        },
      });
      const allRatings = await prisma.rating.findMany({
        where: {
          bookId: bookId
        },
        select: {
          rating: true
        }
      });
      const totalRatingsSum = allRatings.reduce((sum, r) => sum + r.rating, 0);
      newAverageRating = parseFloat((totalRatingsSum / allRatings.length).toFixed(1));
    } else {
      updatedRating = await prisma.rating.create({
        data: {
          userId,
          bookId,
          rating,
        },
      });
      newRatingCount++;
      const totalRatingsSum = (book.averageRating * book.ratingCount) + rating;
      newAverageRating = parseFloat((totalRatingsSum / newRatingCount).toFixed(1));
    }
    await prisma.book.update({
      where: {
        id: bookId
      },
      data: {
        ratingCount: newRatingCount,
        averageRating: newAverageRating,
      },
    });
    return updatedRating;
  } catch (error) {
    throw error;
  }
}