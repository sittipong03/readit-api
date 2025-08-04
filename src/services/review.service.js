import prisma from "../config/prisma.config.js";

export async function createReviewService(
  userId,
  bookId,
  title,
  content,
  reviewPoint
) {
  if (reviewPoint < 1 || reviewPoint > 5) {
    throw new Error("Review point must be between 1 and 5.");
  }

  try {
    const review = await prisma.$transaction(async (prisma) => {
      const newReview = await prisma.review.create({
        data: {
          userId,
          bookId,
          title,
          content,
          reviewPoint,
        },
      });
      const bookReviews = await prisma.review.findMany({
        where: {
          bookId,
        },
        select: {
          reviewPoint: true,
        },
      });

      const totalReviewPoints = bookReviews.reduce(
        (sum, r) => sum + r.reviewPoint,
        0
      );
      const reviewCount = bookReviews.length;
      const averageRating =
        reviewCount > 0
          ? parseFloat((totalReviewPoints / reviewCount).toFixed(1))
          : 0;

      const updateData = {
        reviewCount: reviewCount,
        averageRating: averageRating,
      };
      switch (reviewPoint) {
        case 1:
          updateData.oneStarCount = {
            increment: 1,
          };
          break;
        case 2:
          updateData.twoStarCount = {
            increment: 1,
          };
          break;
        case 3:
          updateData.threeStarCount = {
            increment: 1,
          };
          break;
        case 4:
          updateData.fourStarCount = {
            increment: 1,
          };
          break;
        case 5:
          updateData.fiveStarCount = {
            increment: 1,
          };
          break;
      }

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: updateData,
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          reviewCount: {
            increment: 1,
          },
        },
      });

      return newReview;
    });

    return review;
  } catch (error) {
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("userId") &&
      error.meta?.target?.includes("bookId")
    ) {
      throw new Error("You have already submitted a review for this book.");
    }
    throw error;
  }
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
    if (
      updateData.reviewPoint &&
      updateData.reviewPoint !== existingReview.reviewPoint
    ) {
      await prisma.$transaction(async (prisma) => {
        const oldReviewPoint = existingReview.reviewPoint;
        switch (oldReviewPoint) {
          case 1:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                oneStarCount: {
                  decrement: 1,
                },
              },
            });
            break;
          case 2:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                twoStarCount: {
                  decrement: 1,
                },
              },
            });
            break;
          case 3:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                threeStarCount: {
                  decrement: 1,
                },
              },
            });
            break;
          case 4:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                fourStarCount: {
                  decrement: 1,
                },
              },
            });
            break;
          case 5:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                fiveStarCount: {
                  decrement: 1,
                },
              },
            });
            break;
        }
        const newReviewPoint = updateData.reviewPoint;
        switch (newReviewPoint) {
          case 1:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                oneStarCount: {
                  increment: 1,
                },
              },
            });
            break;
          case 2:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                twoStarCount: {
                  increment: 1,
                },
              },
            });
            break;
          case 3:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                threeStarCount: {
                  increment: 1,
                },
              },
            });
            break;
          case 4:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                fourStarCount: {
                  increment: 1,
                },
              },
            });
            break;
          case 5:
            await prisma.book.update({
              where: {
                id: existingReview.bookId,
              },
              data: {
                fiveStarCount: {
                  increment: 1,
                },
              },
            });
            break;
        }
        const bookReviews = await prisma.review.findMany({
          where: {
            bookId: existingReview.bookId,
            NOT: {
              id: reviewId,
            },
          },
        });

        const totalReviewPoints =
          bookReviews.reduce((sum, r) => sum + r.reviewPoint, 0) +
          newReviewPoint;
        const reviewCount = bookReviews.length + 1; // Add the current review back
        const averageRating =
          reviewCount > 0
            ? parseFloat((totalReviewPoints / reviewCount).toFixed(1))
            : 0;

        await prisma.book.update({
          where: {
            id: existingReview.bookId,
          },
          data: {
            averageRating: averageRating,
          },
        });
      });
    }
    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
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

    await prisma.$transaction(async (prisma) => {
      await prisma.review.delete({
        where: {
          id: reviewId,
        },
      });
      switch (existingReview.reviewPoint) {
        case 1:
          await prisma.book.update({
            where: {
              id: existingReview.bookId,
            },
            data: {
              oneStarCount: {
                decrement: 1,
              },
            },
          });
          break;
        case 2:
          await prisma.book.update({
            where: {
              id: existingReview.bookId,
            },
            data: {
              twoStarCount: {
                decrement: 1,
              },
            },
          });
          break;
        case 3:
          await prisma.book.update({
            where: {
              id: existingReview.book,
            },
            data: {
              threeStarCount: {
                decrement: 1,
              },
            },
          });
          break;
        case 4:
          await prisma.book.update({
            where: {
              id: existingReview.bookId,
            },
            data: {
              fourStarCount: {
                decrement: 1,
              },
            },
          });
          break;
        case 5:
          await prisma.book.update({
            where: {
              id: existingReview.bookId,
            },
            data: {
              fiveStarCount: {
                decrement: 1,
              },
            },
          });
          break;
      }
      const bookReviews = await prisma.review.findMany({
        where: {
          bookId: existingReview.bookId,
        },
        select: {
          reviewPoint: true,
        },
      });
      const totalReviewPoints = bookReviews.reduce(
        (sum, r) => sum + r.reviewPoint,
        0
      );
      const reviewCount = bookReviews.length;
      const averageRating =
        reviewCount > 0
          ? parseFloat((totalReviewPoints / reviewCount).toFixed(1))
          : 0;
      await prisma.book.update({
        where: {
          id: existingReview.bookId,
        },
        data: {
          reviewCount: reviewCount,
          averageRating: averageRating,
        },
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          reviewCount: {
            decrement: 1,
          },
        },
      });
    });

    return {
      message: "Review deleted successfully.",
    };
  } catch (error) {
    throw error;
  }
}
