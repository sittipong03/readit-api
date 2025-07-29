import createError from "../utils/create-error.util.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No valid bearer token found");
      return createError(401, "Token missing");
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        console.log("JWT verification error:", error);
        return createError(401, "Token invalid");
      }

      req.user = decoded.user;

      next();
    });
  } catch (error) {
    console.log("Middleware catch error:", error);
    next(error);
  }
}
