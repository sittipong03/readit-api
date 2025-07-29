import createError from "../utils/create-error.util.js";

export function isOwnerOrAdmin(req, res, next) {
  const userId = req.params.id;
  const user = req.user;

  if (
    user.id === userId ||
    user.role === "admin" ||
    user.role === "publisher"
  ) {
    next();
  } else {
    return createError(403, "You're not allowed to delete this user");
  }
}
