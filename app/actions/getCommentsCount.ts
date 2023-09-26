import prismadb from "@/lib/prismadb";

export const getCommentsCount = async (id: string) => {
  try {
    if (!id) {
      return 0;
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
