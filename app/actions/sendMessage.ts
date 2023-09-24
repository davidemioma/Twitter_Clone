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
      include: {
        memberOne: true,
        memberTwo: true,
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

    const updatedConversation = await prismadb.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        memberOne: true,
        memberTwo: true,
        messages: true,
      },
    });

    await pusherServer.trigger(conversationId, "message:new", newMessage);

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    if (updatedConversation.memberOne.email) {
      await pusherServer.trigger(
        updatedConversation.memberOne.email,
        "conversation:update",
        {
          id: conversationId,
          messages: [lastMessage],
        }
      );
    }

    if (updatedConversation.memberTwo.email) {
      await pusherServer.trigger(
        updatedConversation.memberTwo.email,
        "conversation:update",
        {
          id: conversationId,
          messages: [lastMessage],
        }
      );
    }
  } catch (err: any) {
    throw new Error(`Failed to send message: ${err.message}`);
  }
};
