import * as followerService from "../services/follower.service.js";
import prisma from "../config/prisma.config.js";

export async function isfollowing(req, res) {
  const userId = req.user.id;
  const { userId: targetUserId } = req.params;

  if (userId === targetUserId) {
    return res.status(400).json({ message: "Cannot follow yourself." });
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        }
      }
    });

    res.json({ isFollowing: !!follow });
  } catch (err) {
    console.error('Error checking follow status:', err);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function followUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const targetUserId = req.params.userId;  // from URL param

    if (followerId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself." });
    }

    await followerService.followUser(followerId, targetUserId);
    res.status(200).json({ message: `ติดตามผู้ใช้ ${targetUserId} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const targetUserId = req.params.userId;  // from URL param

    if (followerId === targetUserId) {
      return res.status(400).json({ message: "Cannot unfollow yourself." });
    }

    await followerService.unfollowUser(followerId, targetUserId);
    res.status(200).json({ message: `เลิกติดตามผู้ใช้ ${targetUserId} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

