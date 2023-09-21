"use server";

import prismadb from "@/lib/prismadb";

export const getCommentsCount = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required");
    }

    const count = await prismadb.post.count({
      where: {
        parentId: id,
      },
    });

    return count;
  } catch (err) {
    return 0;
  }
};
