import createError from "../utils/create-error.util.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    console.log("authMiddleware start");
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No valid bearer token");
      return createError(401, "Token missing");
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    console.log("Key ที่ใช้ตรวจสอบ Token:", process.env.JWT_SECRET_KEY);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      console.log("Inside jwt.verify callback");
      if (error) {
        console.log("JWT verify error:", err);
        return createError(401, "Token invalid");
      }
      console.log("Decoded payload:", decoded);
      req.user = decoded.user ?? decoded;
      console.log("req.user set to:", req.user);
      next();
    });
  } catch (error) {
    console.log("Middleware catch error:", error);
    next(error);
  }
}

export async function isReviewOwner(req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const prisma = require("../../prisma").createPrismaClient();
    const review = await prisma.review.findUnique({
      where: {
        id: id,
      },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden: You are not the owner of this review.",
      });
    }
    next();
  } catch (error) {
    console.error("Error in isReviewOwner middleware:", error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}
