import createError from "../utils/create-error.util.js";
import prisma from "../config/prisma.config.js";
import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return next(createError(401, "Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // FIX: ทำให้สามารถหา ID จาก Token ได้ทุกรูปแบบ
    // 1. จาก Login/Refresh Token: decoded.id
    // 2. จาก Google Token: decoded.user.id
    // 3. จาก Token รูปแบบเก่า (ถ้ามี): decoded.userId
    const userId = decoded.id || decoded.user?.id || decoded.userId;

    if (!userId) {
      return next(createError(401, "Invalid token payload: User ID missing"));
    }

    // ตรวจสอบว่าผู้ใช้มีตัวตนจริงในฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return next(createError(401, "User from token not found in database."));
    }
    
    // ส่งต่อข้อมูล user ทั้งหมดไปกับ request
    req.user = user;
    
    next();
  } catch (error) {
    // catch block นี้จะดักจับ error ได้ทั้งหมด (เช่น token หมดอายุ)
    next(error);
  }
}

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.query.token) {
      token = req.query.token;
    }

    // ถ้าไม่มี Token ก็แค่เรียก next() แล้วจบการทำงานทันที
    if (!token) {
      return next(); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.id || decoded.user?.id || decoded.userId;

    // ถ้า token มีแต่ไม่มี userId ก็ไม่ error แค่ไปต่อ
    if (!userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // ถ้าเจอ user ในระบบ, ก็แนบข้อมูลไปกับ req.user
    if (user) {
      req.user = user;
    }

    // ไม่ว่าจะเจอ user หรือไม่ ก็ไปต่อเสมอ
    next();
  } catch (error) {
    // ถ้าเกิด error (เช่น token หมดอายุ, token ผิด) ก็ไม่ block request
    // แค่ log ไว้ (optional) แล้วปล่อยผ่านไปให้เหมือนเป็น guest
    console.error("OptionalAuthMiddleware Error:", error.message);
    next();
  }
};


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
