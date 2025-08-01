import prisma from "../config/prisma.config.js";
import createError from "../utils/create-error.util.js";

export const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return createError(400, "User ID is required");
    }

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: {
        notifications: notifications.map((notification) => ({
          id: notification.id,
          recipientId: notification.recipientId,
          referenceId: notification.referenceId,
          type: notification.type,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        })),
        count: notifications.length,
      },
    });
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    return createError(500, "Internal server error");
  }
};
