"use server";

import prismadb from "@/lib/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export const getPostsByUserId = async (userId: string) => {
  try {
    const posts = await prismadb.post.findMany({
      where: {
        userId,
        isChild: {
          not: true,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return posts;
  } catch (err) {
    return [];
  }
};
