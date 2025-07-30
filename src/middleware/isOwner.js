import createError from "../utils/create-error.util.js";

export const isOwner = (req, res, next) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.user.id;

    // Check if user is accessing their own resources
    if (userId !== requestUserId) {
      return next(
        createError(403, "You are not allowed to access this resource")
      );
    }
    next();
  } catch (error) {
    console.error("isOwner middleware error:", error);
    return next(createError(500, "Internal server error"));
  }
};
