export function authMiddleware(req, res, next) {
    const userIdFromHeader = req.headers['userid'];
    if (!userIdFromHeader) {
        return res.status(401).json({ message: 'Unauthorized: User ID header (userid) is missing.' });
    }
    req.user = {
        id: userIdFromHeader
    };
    next();
}

export async function isReviewOwner(req, res, next) {
  const {
    id
  } = req.params;
  const userId = req.user.id;

  try {
    const prisma = require('../../prisma').createPrismaClient();
    const review = await prisma.review.findUnique({
      where: {
        id: id
      }
    });

    if (!review) {
      return res.status(404).json({
        message: 'Review not found.'
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: 'Forbidden: You are not the owner of this review.'
      });
    }
    next();
  } catch (error) {
    console.error('Error in isReviewOwner middleware:', error);
    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
}