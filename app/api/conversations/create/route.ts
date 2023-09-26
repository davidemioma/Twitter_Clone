import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqBody = await request.json();

    const { userId } = z
      .object({
        userId: z.string(),
      })
      .parse(reqBody);

    if (!userId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const conversationExists = await prismadb.conversation.findFirst({
      where: {
        OR: [
          { memberOneId: currentUser.id, memberTwoId: userId },
          { memberOneId: userId, memberTwoId: currentUser.id },
        ],
      },
    });

    if (conversationExists) {
      return NextResponse.json(conversationExists);
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

    return NextResponse.json(newConversation);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
