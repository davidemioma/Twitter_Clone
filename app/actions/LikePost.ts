"use server";

import prismadb from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
import { pusherServer } from "@/lib/pusher";

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
      include: {
        user: true,
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

      if (postExists.user.email && currentUser.id !== postExists.user.id) {
        const notification = await prismadb.notification.create({
          data: {
            userId: postExists.user.id,
            body: `${currentUser.name} liked your tweet`,
          },
        });

        await prismadb.user.update({
          where: {
            id: postExists.user.id,
          },
          data: {
            hasNotification: true,
          },
        });

        await pusherServer.trigger(
          postExists.user.email,
          "notification:new",
          notification
        );

        await pusherServer.trigger(
          postExists.user.email,
          "notification:on",
          true
        );
      }
    }
  } catch (err: any) {
    throw new Error(
      `Failed to ${hasLiked ? "remove like" : "like"} post: ${err.message}`
    );
  }
};
