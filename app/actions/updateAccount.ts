"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

interface Props {
  name: string;
  username: string;
  bio: string;
  coverImage: string;
  profileImage: string;
}

export const updateAccount = async ({
  name,
  username,
  bio,
  coverImage,
  profileImage,
}: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        coverImage,
        profileImage,
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to update account: ${err.message}`);
  }
};
