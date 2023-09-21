"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

interface Props {
  body: string;
  image?: string;
}

export const createPost = async ({ body, image }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!body) {
      throw new Error("Body is required");
    }

    await prismadb.post.create({
      data: {
        userId: currentUser.id,
        body,
        image: image ? image : "",
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to create post: ${err.message}`);
  }
};
