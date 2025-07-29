import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export async function followUser(followerId, targetUserId) {
  if (followerId === targetUserId) {
    createError(400, "ไม่สามารถติดตามตัวเองได้");
  }
  const newFollow = await prisma.follow
    .create({
      data: {
        followerId: followerId,
        followingId: targetUserId,
      },
    })
    .catch(() => {
      createError(400, "คุณได้ติดตามผู้ใช้นี้แล้ว");
    });

  await prisma.user.update({
    where: { id: targetUserId },
    data: { followerCount: { increment: 1 } },
  });
  return newFollow;
}

export async function unfollowUser(followerId, targetUserId) {
  const deletedFollow = await prisma.follow
    .delete({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: targetUserId,
        },
      },
    })
    .catch(() => {
      createError(400, "คุณยังไม่ได้ติดตามผู้ใช้คนนี้");
    });

  if (deletedFollow) {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { followerCount: { decrement: 1 } },
    });
  }
  return deletedFollow;
}
