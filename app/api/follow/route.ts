import { z } from "zod";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const reqBody = await request.json();

    const { profileUserId, isFollowing } = z
      .object({
        profileUserId: z.string(),
        isFollowing: z.boolean(),
      })
      .parse(reqBody);

    if (!profileUserId) {
      return new NextResponse("User ID required", { status: 400 });
    }

    const profileExists = await prismadb.user.findUnique({
      where: {
        id: profileUserId,
      },
    });

    if (!profileExists) {
      return new NextResponse("Profile does not exist", { status: 400 });
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

    return NextResponse.json("Successful");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
