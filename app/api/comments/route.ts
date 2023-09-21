import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const { limit, page, postId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        postId: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
        postId: url.searchParams.get("postId"),
      });

    const comments = await prismadb.post.findMany({
      where: {
        parentId: postId,
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
