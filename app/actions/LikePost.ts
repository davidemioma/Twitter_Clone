"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";

interface Props {
  postId: string;
  hasLiked: boolean;
}

export const likePost = async ({ postId, hasLiked }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!postId) {
      throw new Error("Post ID is required");
    }

    const postExists = await prismadb.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new Error("Post does not exists");
    }

    if (hasLiked) {
      await prismadb.post.update({
        where: {
          id: postId,
        },
        data: {
          liked: {
            disconnect: {
              id: currentUser.id,
            },
          },
        },
      });
    } else {
      await prismadb.post.update({
        where: {
          id: postId,
        },
        data: {
          liked: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });
    }
  } catch (err: any) {
    throw new Error(
      `Failed to ${hasLiked ? "remove like" : "like"} post: ${err.message}`
    );
  }
};
