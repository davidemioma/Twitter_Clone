import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";
import { getCurrentUser } from "./getCurrentUser";

export const getSearchedUsers = async (searchQuery: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

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

    return results;
  } catch (err) {
    return [];
  }
};
