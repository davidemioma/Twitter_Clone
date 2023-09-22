"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { pusherServer } from "@/lib/pusher";

export const turnOffNotification = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        hasNotification: false,
      },
    });

    if (currentUser.email) {
      await pusherServer.trigger(currentUser?.email, "notification:off", false);
    }
  } catch (err: any) {
    throw new Error(`Failed to turn off notification: ${err.message}`);
  }
};
