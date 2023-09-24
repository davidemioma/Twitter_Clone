"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

export const getConversations = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const conversations = await prismadb.conversation.findMany({
      where: {
        OR: [{ memberOneId: currentUser.id }, { memberTwoId: currentUser.id }],
      },
      include: {
        memberOne: true,
        memberTwo: true,
        messages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return conversations;
  } catch (err) {
    return [];
  }
};
