import * as followerService from "../services/follower.service.js";

export async function followUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const { targetUserId } = req.body;

    console.log("--- Follow Request Received ---");
    console.log("1. Follower ID (from Token):", followerId);
    console.log("2. Target User ID (from Body):", targetUserId);

    await followerService.followUser(followerId, targetUserId);
    res.status(200).json({ message: `ติดตามผู้ใช้ ${targetUserId} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const followerId = req.user.id;
    const { targetUserId } = req.body;

    await followerService.unfollowUser(followerId, targetUserId);
    res
      .status(200)
      .json({ message: `เลิกติดตามผู้ใช้ ${targetUserId} สำเร็จ` });
  } catch (error) {
    next(error);
  }
}
