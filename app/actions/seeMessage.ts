"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { pusherServer } from "@/lib/pusher";

interface Props {
  conversationId: string;
}

export const seeMessage = async ({ conversationId }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const conversation = await prismadb.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation does not exists");
    }

    //Get the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) return;

    const seen = lastMessage.seenIds.includes(currentUser.id)
      ? [...lastMessage.seenIds]
      : [currentUser.id, ...lastMessage.seenIds];

    const updatedMessage = await prismadb.message.update({
      where: {
        id: lastMessage.id,
      },
      data: {
        seenIds: [...seen],
      },
    });

    if (currentUser.email) {
      await pusherServer.trigger(currentUser.email, "conversation:update", {
        id: conversationId,
        messages: [updatedMessage],
      });
    }
  } catch (err: any) {
    throw new Error(`Failed to send message: ${err.message}`);
  }
};
