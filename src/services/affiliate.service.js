import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";
import { nanoid } from "nanoid";

// export async function testGetAffiliate () {
//     return await prisma.user.findMany()
// }

export async function registerAffiliate(userId, accountDatails, methodType) {
  const existAffiliate = await prisma.affiliate.findUnique({
    where: { userId: userId },
  });
  if (existAffiliate) {
    createError(400, "คุณได้สมัครเป็น Affiliate แล้ว");
  }

  const affiliateCode = nanoid(10);

  const newAffiliate = await prisma.affiliate.create({
    data: {
      userId: userId,
      affiliateCode: affiliateCode,
      methodType: methodType,
      accountDetails: accountDatails,
      status: "ACTIVE",
    },
  });

  return newAffiliate;
}

export async function getAffiliate(userId) {
  const affiliate = await prisma.affiliate.findUnique({
    where: { userId: userId },
    include: {
      commissions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!affiliate) {
    createError(404, "ไม่พบข้อมูล Affiliate");
  }
  return affiliate;
}
