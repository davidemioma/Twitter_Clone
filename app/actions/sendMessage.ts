"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { pusherServer } from "@/lib/pusher";

interface Props {
  conversationId: string;
  body: string;
  image: string;
}

export const sendMessage = async ({ conversationId, body, image }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const conversationExists = await prismadb.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversationExists) {
      throw new Error("Conversation does not exists");
    }

    const newMessage = await prismadb.message.create({
      data: {
        userId: currentUser.id,
        conversationId,
        body,
        image,
        seenIds: [currentUser.id],
      },
    });

    if (conversationId && newMessage) {
      await pusherServer.trigger(conversationId, "message:new", newMessage);
    }
  } catch (err: any) {
    throw new Error(`Failed to send message: ${err.message}`);
  }
};
