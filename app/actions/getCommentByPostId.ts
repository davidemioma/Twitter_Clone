import prismadb from "@/lib/prismadb";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";

export const getCommentByPostId = async (id: string) => {
  try {
    if (!id) {
      return [];
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
      take: INFINITE_SCROLL_PAGINATION_RESULTS,
    });

    return comments;
  } catch (err) {
    return [];
  }
};
