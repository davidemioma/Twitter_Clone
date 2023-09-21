"use server";

import prismadb from "@/lib/prismadb";

export const getPosts = async () => {
  try {
    const posts = await prismadb.post.findMany({
      where: {
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
    });

    return posts;
  } catch (err) {
    return [];
  }
};
