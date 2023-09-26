import prismadb from "@/lib/prismadb";

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
    });

    return posts;
  } catch (err) {
    return [];
  }
};
