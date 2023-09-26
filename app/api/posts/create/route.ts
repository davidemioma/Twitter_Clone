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

    const { body, image } = z
      .object({
        body: z.string(),
        image: z.string(),
      })
      .parse(reqBody);

    await prismadb.post.create({
      data: {
        userId: currentUser.id,
        body,
        image,
      },
    });

    return NextResponse.json("Post created");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
