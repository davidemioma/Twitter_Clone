import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqBody = await request.json();

    const { name, username, bio, coverImage, profileImage } = z
      .object({
        name: z.string(),
        username: z.string(),
        bio: z.string(),
        coverImage: z.string(),
        profileImage: z.string(),
      })
      .parse(reqBody);

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        coverImage,
        profileImage,
      },
    });

    return NextResponse.json("Account updated");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
