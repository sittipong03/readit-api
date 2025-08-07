import prisma from "../config/prisma.config.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/create-error.util.js";
import nodemailer from "nodemailer";
import * as authService from "../services/auth.service.js";

// ฟังก์ชัน register ไม่มีการเปลี่ยนแปลง เพราะสร้าง Verification Token ถูกต้องอยู่แล้ว
export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    let { name } = req.body;
    if (!name) {
      name = email.split("@")[0];
    }

    const checkEmail = await authService.getUserByEmail(email);
    if (checkEmail) {
      return next(createError(400, "Email already exists"));
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await authService.createNewUser(name, email, hashPassword);

    // This is a VERIFICATION token, its payload is correct for its purpose.
    const token = jwt.sign(
      { user: newUser.id }, // Payload for verification is { user: "string" }
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `${process.env.URL_BACKEND}/api/auth/verification/${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Email Verification",
      html: `<p>Please verify by clicking the following link: <a href="${verificationLink}" target="_blank">Click here</a></p>`,
    });

    res.status(201).json({
      message: "Verification email has been sent.",
      newUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await authService.getUserByEmail(email);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.emailVerified === false) {
      // Logic for re-sending verification is ok, no changes needed.
      return next(createError(403, "Please verify your email first. A new verification link can be requested."));
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(401, "Invalid email or password"));
    }

    // FIX: Standardize payload for all auth-related tokens
    const accessTokenPayload = {
      id: user.id,
      role: user.role,
    };
    const refreshTokenPayload = {
      id: user.id, // Use 'id' for consistency
      role: user.role,
    };

    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}

// ฟังก์ชัน getMe ถูกต้องแล้ว เพราะใช้ req.user.id จาก middleware ตัวใหม่
export async function getMe(req, res, next) {
  try {
    // req.user is populated by the robust authMiddleware
    res.json({
      success: true,
      result: req.user,
    });
  } catch (error) {
    next(error);
  }
}

// FIX: Rewritten for clarity and correctness
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Delete the specific refresh token from the database
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      }).catch(err => {
        // If token is not found, it's fine. Continue the logout process.
        console.log("Refresh token from cookie not found, continuing logout.");
      });
    }

    // Clear the cookie on the client's browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

// ADDED BACK: forgotPassword function
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if a user exists or not for security reasons
      return res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Create a temporary token that includes the user's current password hash
    // This invalidates the token if the password is changed
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.URL_FRONTEND}/reset-password/${token}`;
    
    // Logic to send email (e.g., using nodemailer)
    console.log("Password Reset Link:", resetLink); // For testing
    // await sendResetEmail(user.email, resetLink);

    res.status(200).json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}


export async function resetPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // FIX: Use req.user.id from middleware

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isValidPassword = await bcryptjs.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return next(createError(400, "Current password is incorrect"));
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    next(error);
  }
}

// ฟังก์ชัน verification ถูกต้องแล้ว ไม่ต้องใช้ authMiddleware
export async function verification(req, res, next) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // This token's payload is { user: "some-id" }
    const userId = decoded.user;
    if (!userId) {
      return next(createError(400, "Invalid verification token."));
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // Redirect to the frontend login page after successful verification
    res.redirect(process.env.URL_FRONTEND + "/login");
  } catch (error) {
    next(error);
  }
}

// ADDED BACK: deleteUser function
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await authService.getUserById(id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    await authService.deleteUser(id);
    res.status(200).json({ message: `User ${user.email} has been deleted.` });
  } catch (error) {
    next(error);
  }
}


export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(createError(401, "No refresh token provided"));
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      return next(createError(401, "Invalid or expired refresh token"));
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      return next(createError(401, "Refresh token expired. Please log in again."));
    }

    // Verify the refresh token itself
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    
    // FIX: Use 'id' for consistency
    const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role }, // Assuming role is needed
        process.env.JWT_SECRET_KEY, 
        { expiresIn: "1d" }
    );

    res.json({
        message: "Token refreshed successfully",
        accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
}
