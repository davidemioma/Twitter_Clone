"use server";

import prismadb from "@/lib/prismadb";
import { getRandomUsers } from "@/lib/utils";
import { getCurrentUser } from "./getCurrentUser";

export const getSuggestions = async (amount: number) => {
  try {
    const currentUser = await getCurrentUser();

    const users = await prismadb.user.findMany({
      where: {
        id: {
          not: currentUser?.id,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const suggestions = getRandomUsers(users, amount);

    return suggestions;
  } catch (err) {
    return [];
  }
};
