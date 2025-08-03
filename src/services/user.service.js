import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";
import bcryptjs from "bcryptjs";

export async function testGetUser() {
  return await prisma.user.findMany();
}

export async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
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
      userAddress: true,
    },
  });
  return user;
}

export const updateUserProfileAndAddress = async (userId, profileData) => {
  const updatedData = await prisma.$transaction(async (tx) => {
    const userDataToUpdate = {};
    if (profileData.name !== undefined) {
      userDataToUpdate.name = profileData.name;
    }

    if (Object.keys(userDataToUpdate).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userDataToUpdate,
      });
    }

    const isAddressUpdate = [
      "firstName",
      "lastName",
      "mobile",
      "address",
      "province",
      "city",
      "postalCode",
    ].some((key) => profileData[key] !== undefined);

    if (isAddressUpdate) {
      const addressData = {
        receiverName: `${profileData.firstName || ""} ${
          profileData.lastName || ""
        }`.trim(),
        address: profileData.address,
        province: profileData.province,
        city: profileData.city,
        postalCode: profileData.postalCode,
        phoneNumber: profileData.phoneNumber,
        country: "Thailand",
      };

      const existingAddress = await tx.userAddress.findFirst({
        where: { userId: userId, isDefault: true },
      });

      if (existingAddress) {
        await tx.userAddress.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
      } else {
        if (
          addressData.receiverName &&
          addressData.address &&
          addressData.province &&
          addressData.city &&
          addressData.postalCode
        ) {
          await tx.userAddress.create({
            data: { ...addressData, userId: userId, isDefault: true },
          });
        }
      }
    }

    const finalUser = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        userAddress: true,
      },
    });

    return finalUser;
  });

  return updatedData;
};

export const deleteUserAccount = async (userId) => {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw createError(404, "User not found");
    }

    // --- ลบข้อมูลที่เกี่ยวข้องก่อน ---
    await tx.userAddress.deleteMany({ where: { userId: userId } });
    await tx.follow.deleteMany({
      where: { OR: [{ followerId: userId }, { followingId: userId }] },
    });
    await tx.cart.deleteMany({ where: { userId: userId } });
    await tx.refreshToken.deleteMany({ where: { userId: userId } });
    // เพิ่มการลบข้อมูลจากตารางอื่นๆ ตามความจำเป็น...

    // --- สุดท้าย ลบตัว User เอง ---
    await tx.user.delete({
      where: { id: userId },
    });

    return { message: "Account deleted successfully" };
  });
};

export const updateUserAvatar = async (userId, avatarUrl) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: avatarUrl },
    include: {
      userAddress: true, // ดึงข้อมูลที่อยู่มาด้วย
    },
  });
  return updatedUser;
};

export async function postAddressById(userid, data) {
  return await prisma.userAddress.create({
    where: { userid },
    data,
  });
}

export async function patchAddressById(userid, data) {
  return await prisma.userAddress.update({
    where: { userid },
    data,
  });
}
