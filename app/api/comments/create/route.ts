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

    const { postId, body, image } = z
      .object({
        postId: z.string(),
        body: z.string(),
        image: z.string(),
      })
      .parse(reqBody);

    if (!postId) {
      return new NextResponse("Post ID required", { status: 400 });
    }

    const postExists = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      return new NextResponse("Post does not exist", { status: 400 });
    }

    await prismadb.post.create({
      data: {
        userId: currentUser.id,
        body,
        image,
        parentId: postId,
        isChild: true,
      },
    });

    return NextResponse.json("Comment created");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
