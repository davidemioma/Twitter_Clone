"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    if (!memberOneId || !memberTwoId) {
      return null;
    }

    const conversation = await prismadb.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });

    return conversation;
  } catch (err) {
    return null;
  }
};

export const createConversation = async (userId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("User ID required");
    }

    const conversationExists =
      (await findConversation(currentUser.id, userId)) ||
      (await findConversation(userId, currentUser.id));

    if (conversationExists) {
      return conversationExists;
    }

    const newConversation = await prismadb.conversation.create({
      data: {
        memberOneId: currentUser.id,
        memberTwoId: userId,
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });

    return newConversation;
  } catch (err: any) {
    throw new Error(`Failed to create post: ${err.message}`);
  }
};
