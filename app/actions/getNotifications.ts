import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getNotifications = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const notifications = await prismadb.notification.findMany({
      where: {
        userId: currentUser.id,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (err) {
    return [];
  }
};
