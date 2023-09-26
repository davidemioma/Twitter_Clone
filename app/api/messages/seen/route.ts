import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqBody = await request.json();

    const { conversationId } = z
      .object({
        conversationId: z.string(),
      })
      .parse(reqBody);

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
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
      return new NextResponse("Conversation does not exist", { status: 400 });
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

    return NextResponse.json("Successful");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
