import prisma from "../config/prisma.config.js";
import bcryptjs from "bcryptjs";
import createError from "../utils/create-error.util.js";
import * as userService from "../services/user.service.js";

export async function testGet(req, res, next) {
  try {
    const data = await userService.testGetUser();
    res.json({ data, message: "User" });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);
    res.json({ result: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcryptjs.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    if (error.code === "P2025") {
      return createError(404, "User not found");
    }
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return createError(404, "User not found");
    }
    next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const { id } = req.params;
    const dataFromFrontend = req.body;

    // Call the service layer to handle all the logic
    const updatedUser = await userService.updateUserProfileAndAddress(
      id,
      dataFromFrontend
    );

    res.json({
      message: "อัปเดตข้อมูลโปรไฟล์สำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // เรียกใช้ service เพื่อจัดการ logic ทั้งหมด
    await userService.changeUserPassword(id, { currentPassword, newPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}

export const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return next(createError(400, "avatarUrl is required"));
    }

    const updatedUser = await userService.updateUserAvatar(userId, avatarUrl);
    res.json({ message: "Avatar updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentUser = async (req, res, next) => {
  try {
    const userIdToDelete = req.user.id;
    await userService.deleteUserAccount(userIdToDelete);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export async function checkBookTagPreference(req, res) {
  try {
    console.log("checkBookTagPreference called. req.user:", req.user);

    const userId = req.user?.id;
    if (!userId) {
      console.error("User ID not found in req.user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const firstPreference = await prisma.bookTagPreference.findFirst({
      where: { userId },
      select: { id: true },
    });

    const hasPreferences = !!firstPreference;
    res.json({ hasPreferences });

  } catch (error) {
    console.error("Error checking book tag preference:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const saveBookTagPreferences = async (req, res) => {
  const userId = req.user?.id;
  const { tagIds } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return res.status(400).json({ message: "No tags provided" });
  }

  try {
    // Optional: remove previous preferences first (if needed)
    await prisma.bookTagPreference.deleteMany({ where: { userId } });

    // Create new preferences
    const data = tagIds.map((tagId) => ({
      userId,
      tagId,
    }));

    await prisma.bookTagPreference.createMany({ data });

    res.status(200).json({ message: "Preferences saved" });
  } catch (err) {
    console.error("Error saving tag preferences:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};