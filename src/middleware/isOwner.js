import createError from "../utils/create-error.util";

export const isOwner = (req, res, next) => {
  try {
    const { userId } = req.params;
    const requestUserId = req.userId;

    // Check if user is accessing their own resources
    if (userId !== requestUserId) {
      return createError(403, "You are not allowed to access this resource");
    }
  } catch (error) {
    console.error("isOwner middleware error:", error);
    return createError(500, "Internal server error");
  }
};
