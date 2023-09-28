import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqBody = await request.json();

    const { conversationId, body, image } = z
      .object({
        conversationId: z.string(),
        body: z.string(),
        image: z.string(),
      })
      .parse(reqBody);

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
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
      return new NextResponse("Conversation does not exist", {
        status: 400,
      });
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

    return NextResponse.json("Comment created");
  } catch (err) {
    console.log("SEND_MESSAGE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
