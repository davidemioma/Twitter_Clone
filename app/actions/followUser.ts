"use server";

import prismadb from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "./getCurrentUser";

interface Props {
  profileUserId: string;
  isFollowing: boolean;
}

export const followUser = async ({ profileUserId, isFollowing }: Props) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    if (!profileUserId) {
      throw new Error("User ID is required");
    }

    const profileExists = await prismadb.user.findUnique({
      where: {
        id: profileUserId,
      },
    });

    if (!profileExists) {
      throw new Error("User does not exists");
    }

    if (isFollowing) {
      await prismadb.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingsIds: currentUser.followingsIds.filter(
            (id) => id !== profileUserId
          ),
        },
      });

      await prismadb.user.update({
        where: {
          id: profileUserId,
        },
        data: {
          followersIds: profileExists.followersIds.filter(
            (id) => id !== currentUser.id
          ),
        },
      });

      if (profileExists.email && profileExists.id !== currentUser.id) {
        const followersCount = await prismadb.user.count({
          where: {
            followingsIds: {
              has: profileExists.id,
            },
          },
        });

        await pusherServer.trigger(
          profileExists.email,
          "follower:unfollow",
          followersCount
        );
      }
    } else {
      await prismadb.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          followingsIds: [...currentUser.followingsIds, profileUserId],
        },
      });

      await prismadb.user.update({
        where: {
          id: profileUserId,
        },
        data: {
          followersIds: [...profileExists.followersIds, currentUser.id],
        },
      });

      if (profileExists.email && profileExists.id !== currentUser.id) {
        const notification = await prismadb.notification.create({
          data: {
            userId: profileExists.id,
            body: `${currentUser.name} started following you`,
          },
        });

        await prismadb.user.update({
          where: {
            id: profileExists.id,
          },
          data: {
            hasNotification: true,
          },
        });

        await pusherServer.trigger(
          profileExists.email,
          "notification:new",
          notification
        );

        await pusherServer.trigger(
          profileExists.email,
          "notification:on",
          true
        );

        const followersCount = await prismadb.user.count({
          where: {
            followingsIds: {
              has: profileExists.id,
            },
          },
        });

        await pusherServer.trigger(
          profileExists.email,
          "follower:new",
          followersCount
        );
      }
    }
  } catch (err: any) {
    throw new Error(
      `Failed to ${isFollowing ? "unfollow" : "follow"} user: ${err.message}`
    );
  }
};
