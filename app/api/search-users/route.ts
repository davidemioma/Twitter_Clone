import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(request.url);

    const { searchQuery } = z
      .object({
        searchQuery: z.string(),
      })
      .parse({
        searchQuery: url.searchParams.get("searchQuery"),
      });

    let results: User[] = [];

    if (searchQuery) {
      results = await prismadb.user.findMany({
        where: {
          id: {
            not: currentUser?.id,
          },
          OR: [{ name: searchQuery }, { username: searchQuery }],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      results = await prismadb.user.findMany({
        where: {
          id: {
            in: [...currentUser?.followingsIds],
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }

    return NextResponse.json(results);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
