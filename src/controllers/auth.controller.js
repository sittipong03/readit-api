import prisma from "../config/prisma.config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import createError from "../utils/create-error.util.js";
import nodemailer from "nodemailer";
import * as authService from "../services/auth.service.js";

export async function testGetUser(req, res, next) {
  try {
    const data = await authService.testGetUser();
    res.json({ data, message: "auth" });
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    let { name } = req.body
    if(!name){
      const addname = email.split("@")[0]
      console.log(addname)
      name = addname
    }

    const checkEmail = await authService.getUserByEmail(email);

    if (checkEmail) {
      return createError(400, "Email already exist");
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await authService.createNewUser(name, email, hashPassword);

    const token = jwt.sign(
      { user: newUser.id },
      process.env.JWT_SECRET_KEY || "kkbkjjkh",
      {
        expiresIn: "7d",
      }
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.URL}/api/auth/verification/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify by clicking the following link : </p> <a href=${verificationLink} target="_blank" rel="noopener noreferrer">Click this link</a>`,
    });
    res.json({
      message: "Verification email has been sent to your email",
      newUser,
    });
    res.status(200).json({ message: "Create account success", newUser });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      return createError(400, "User not found");
    }
    if (user.isVerify === false) {
      const token = jwt.sign(
        { user: user.id, email: user.email },
        process.env.JWT_SECRET_KEY || "tirefg",
        {
          expiresIn: "7d",
        }
      );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ADMIN,
          pass: process.env.EMAIL_PASS,
        },
      });
      const verificationLink = `${process.env.URL}/auth/verification/${token}`;

      await transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: `
                <p>Please verify by clicking the following link : </p> <a href=${verificationLink} target="_blank" rel="noopener noreferrer">Click this link</a>`,
      });
      return createError(400, "Please verify your email first");
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return createError(400, "Wrong password");
    }

    console.log("User object:", user);
    console.log("User ID:", user.id);
    console.log("User email:", user.email);
    console.log("User role:", user.role);

    console.log("User data before token creation:", {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    console.log("Token payload:", payload);
    console.log("Key ที่ใช้สร้าง Token:", process.env.JWT_SECRET_KEY);
    const generateToken = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      process.env.JWT_SECRET_KEY || "ridifgd",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token: generateToken,
      userId: user.id,
      role: user.role,
      user: user.name

    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    console.log("req.user in getMe:", req.user); // Debug
    console.log("Type of req.user:", typeof req.user); // Debug
    console.log("req.user.id:", req.user?.id); // Debug

    if (!req.user) {
      return createError(401, "User not authenticated");
    }

    if (!req.user.id) {
      return createError(401, "User ID not found in request");
    }

    const userId = req.user.id;
    console.log("Using userId:", userId);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        reviewCount: true,
        followerCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return createError(404, { success: false, message: "User not found" });
    }

    res.json({
      success: true,
      result: user,
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
    res.clearCookie("authToken");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}

async function sendResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_ADMIN,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADMIN,
    to: email,
    subject: "Reset Your Password",
    text: `Click this link to reset your password: http://localhost:5173/api/auth/reset/${token}`,
  };
  await transporter.sendMail(mailOptions);
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      return createError(400, "User not found");
    }

    const resetToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET_KEY + user.password,
      { expiresIn: "1h" }
    );

    await sendResetEmail(email, resetToken);
    res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    next(error);
  }
}
export async function resetPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await bcryptjs.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        error: "New password must be different from current password",
      });
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    next(error);
  }
}

export async function verification(req, res, next) {
  try {
    const { token } = req.params;
    const headers = jwt.verify(token, process.env.JWT_SECRET);
    if (!headers) {
      return createError(404, "Token Missing");
    }
    const user = await prisma.user.findFirst({
      where: { id: headers.user },
    });
    console.log(user);
    if (!user) {
      return createError(404, "User not existed");
    }
    const verify = await prisma.user.update({
      where: {
        id: headers.user,
      },
      data: {
        isVerify: true,
      },
    });
    res.redirect("http://localhost:5173/login");
  } catch (error) {
    next(error);
  }
}
