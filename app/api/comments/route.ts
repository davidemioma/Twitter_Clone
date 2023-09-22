import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const { postId, limit, page } = z
      .object({
        postId: z.string(),
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        postId: url.searchParams.get("postId"),
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    const comments = await prismadb.post.findMany({
      where: {
        parentId: postId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    return NextResponse.json(comments);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
