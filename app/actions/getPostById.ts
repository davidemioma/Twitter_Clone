"use server";

import prismadb from "@/lib/prismadb";

export const getPostById = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required");
    }

    const post = await prismadb.post.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    return post;
  } catch (err) {
    return null;
  }
};
