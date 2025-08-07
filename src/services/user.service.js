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

export async function getFullUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      // --- ข้อมูล User หลัก ---
      id: true,
      name: true,
      email: true, // อาจจะไม่ต้องส่งไปถ้าไม่จำเป็น
      avatarUrl: true,
      createdAt: true,

      // --- ดึงจาก Field ที่ทำ Denormalize ไว้แล้ว (ถูกต้องและเร็วมาก) ---
      followerCount: true,
      reviewCount: true,

      _count: {
        select: {
          following: true, // ✅ จำนวนที่ user คนนี้ไปติดตามคนอื่น
          likes: true, // ✅ จำนวนที่ user คนนี้ไปกดไลก์รีวิว
        },
      },

      // --- ดึงข้อมูล Relation ที่ซับซ้อน (Include) ---

      // 1. ดึงรีวิวล่าสุด 5 รายการ
      review: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          // ซ้อนเข้าไปเพื่อดึงข้อมูลหนังสือของรีวิวนั้นๆ
          book: {
            select: {
              id: true,
              title: true,
              // ดึง coverImage จาก Edition ที่เป็น isLatest
              edition: {
                where: { isLatest: true },
                select: {
                  coverImage: true,
                },
              },
            },
          },
        },
      },

      // 2. ดึงข้อมูลชั้นหนังสือ (Shelves) ทั้งหมด
      shelf: {
        orderBy: { addedAt: "desc" },
        select: {
          shelfType: true,
          addedAt: true,
          // ดึงข้อมูลหนังสือในชั้นนั้นๆ
          book: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },

      // 3. ดึงที่อยู่หลัก (Default Address)
      userAddress: {
        where: { isDefault: true },
      },

      bookTagPreference: {
        // เลือกเฉพาะข้อมูลของ Tag ที่เกี่ยวข้อง
        select: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
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

export async function updateUserPreferencesService(userId, tagIds) {
  return await prisma.$transaction([
    prisma.bookTagPreference.deleteMany({
      where: { userId: userId },
    }),
    prisma.bookTagPreference.createMany({
      data: tagIds.map((tagId) => ({
        userId: userId,
        tagId: tagId,
      })),
    }),
  ]);
}

export async function getUserPreferencesService(userId) {
  const preferences = await prisma.bookTagPreference.findMany({
    where: {
      userId: userId,
    },
    select: {
      tagId: true,
    },
  });

  // แปลงผลลัพธ์จาก [{ tagId: '...' }, { tagId: '...' }]
  // ให้เป็น array ของ string ง่ายๆ -> ['...', '...']
  return preferences.map((p) => p.tagId);
}
