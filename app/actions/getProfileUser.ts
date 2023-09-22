"use server";

import prismadb from "@/lib/prismadb";

export const getProfileUser = async (id: string) => {
  try {
    if (!id) return null;

    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return user;
  } catch (err) {
    return null;
  }
};
