"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

interface Props {
  postId: string;
  body: string;
  image?: string;
}

export const createComment = async ({ postId, body, image }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!postId) {
      throw new Error("Post ID is required");
    }

    if (!body) {
      throw new Error("Body is required");
    }

    const postExists = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new Error("Post does not exists");
    }

    await prismadb.post.create({
      data: {
        userId: currentUser.id,
        body,
        image: image ? image : "",
        parentId: postId,
        isChild: true,
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to create comment: ${err.message}`);
  }
};
