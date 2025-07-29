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
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcryptjs.hash(updateData.password, 10);
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
