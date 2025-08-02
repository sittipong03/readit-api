import createError from "../utils/create-error.util.js";
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header", authHeader);

    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("Extracted token", token);
    }

    // ✅ ถ้าไม่มี Bearer token ให้ลองหาจาก query parameter
    if (!token && req.query.token) {
      token = req.query.token;
      console.log("Token from query", token);
    }

    // ✅ ถ้าไม่มี token เลย ถึงจะ throw error
    if (!token) {
      console.log("No valid bearer token found");
      throw createError("Token missing", 401);
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
      if (error) {
        console.log("JWT verification error", error);
        return createError(401, "Token invalid");
      }

      console.log("Decoded token", decoded);
      console.log("User object", decoded.user);

      req.user = decoded.user ?? decoded;

      next();
    });
  } catch (error) {
    console.log("Middleware catch error", error);
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
