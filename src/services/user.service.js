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
    },
  });
  return user;
}

export async function updateUserProfileAndAddress(userId, profileData) {
  const updatedData = await prisma.$transaction(async (tx) => {
    // 1. เตรียมข้อมูลสำหรับตาราง User (เช่น name, mobile, bank info)
    const userDataToUpdate = {};
    if (profileData.name !== undefined) {
      userDataToUpdate.name = profileData.name;
    }

    // ===== จุดที่แก้ไข =====
    // คอมเมนต์โค้ดส่วนนี้ออกไปก่อน เนื่องจากฟิลด์เหล่านี้ยังไม่มีใน schema.prisma
    // หากต้องการใช้งานฟิลด์เหล่านี้ คุณต้องไปเพิ่มในโมเดล User และรัน migration ก่อน
    /*
    if (profileData.mobile !== undefined) {
      userDataToUpdate.mobile = profileData.mobile;
    }
    if (profileData.bankAccount !== undefined) {
        userDataToUpdate.bankAccount = profileData.bankAccount;
    }
    if (profileData.bankName !== undefined) {
        userDataToUpdate.bankName = profileData.bankName;
    }
    */
    // =======================

    // อัปเดตข้อมูลในตาราง User ถ้ามีข้อมูลส่งมา
    if (Object.keys(userDataToUpdate).length > 0) {
      await tx.user.update({
        where: { id: userId },
        data: userDataToUpdate,
      });
    }

    // 2. ตรวจสอบว่าเป็นการอัปเดตที่อยู่หรือไม่
    // โดยเช็คว่า province ที่ส่งมาต้องไม่ใช่ค่าว่าง (ไม่ใช่ undefined และไม่ใช่ "")
    if (profileData.province) {
      const addressData = {
        receiverName: `${profileData.firstName || ""} ${
          profileData.lastName || ""
        }`.trim(),
        address: profileData.address, // <--- แก้ไขชื่อฟิลด์ตรงนี้ จาก addressLine1 เป็น address
        province: profileData.province,
        city: profileData.city,
        postalCode: profileData.postalCode,
        country: "Thailand",
      };

      // ตรวจสอบข้อมูลที่จำเป็นอีกครั้งก่อนดำเนินการ
      if (!addressData.city || !addressData.postalCode) {
        throw new Error(
          "City and Postal Code are required when updating an address."
        );
      }

      const existingAddress = await tx.userAddress.findFirst({
        where: { userId: userId, isDefault: true },
      });

      if (existingAddress) {
        await tx.userAddress.update({
          where: { id: existingAddress.id },
          data: addressData,
        });
      } else {
        await tx.userAddress.create({
          data: { ...addressData, userId: userId, isDefault: true },
        });
      }
    }

    // 3. ดึงข้อมูล User ล่าสุดทั้งหมดพร้อมที่อยู่เพื่อส่งกลับไป
    const finalUser = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        userAddress: true, // ดึงข้อมูลที่อยู่อัปเดตล่าสุดมาด้วย
      },
    });

    return finalUser;
  });

  return updatedData;
}

export async function changeUserPassword(userId, passwordData) {
  const { currentPassword, newPassword } = passwordData;

  // 1. ค้นหาผู้ใช้พร้อมกับรหัสผ่านปัจจุบัน
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError(404, "User not found");
  }

  // 2. ตรวจสอบว่ารหัสผ่านปัจจุบันที่กรอกมาถูกต้องหรือไม่
  const isMatch = await bcryptjs.compare(currentPassword, user.password);
  if (!isMatch) {
    throw createError(400, "Current password is incorrect");
  }

  // 3. ถ้าถูกต้อง ให้ hash รหัสผ่านใหม่
  const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

  // 4. อัปเดตรหัสผ่านใหม่ลงในฐานข้อมูล
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });

  // ไม่ต้องส่งข้อมูลอะไรกลับไป เพราะทำสำเร็จแล้ว
  return;
}
