"use server";

import prismadb from "@/lib/prismadb";

export const getPosts = async () => {
  try {
    const posts = await prismadb.post.findMany({
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
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
