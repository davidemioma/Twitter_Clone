import prismadb from "@/lib/prismadb";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const MESSAGE_BATCH = 10;

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get("cursor");

    const conversationId = searchParams.get("conversationId");

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID required", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await prismadb.message.findMany({
        where: {
          conversationId,
        },
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await prismadb.message.findMany({
        where: {
          conversationId,
        },
        take: MESSAGE_BATCH,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({ messages, nextCursor });
  } catch (err) {
    console.log("GET_MESSAGES", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
