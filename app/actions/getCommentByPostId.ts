"use server";

import prismadb from "@/lib/prismadb";

export const getCommentByPostId = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required");
    }

    const comments = await prismadb.post.findMany({
      where: {
        parentId: id,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return comments;
  } catch (err) {
    return [];
  }
};
