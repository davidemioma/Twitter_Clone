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

    const { postId, hasLiked } = z
      .object({
        postId: z.string(),
        hasLiked: z.boolean(),
      })
      .parse(reqBody);

    if (!postId) {
      return new NextResponse("Post ID required", { status: 400 });
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
      return new NextResponse("Post does not exist", { status: 400 });
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

    return NextResponse.json("Successful");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
