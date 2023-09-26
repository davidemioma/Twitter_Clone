import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        hasNotification: false,
      },
    });

    if (currentUser.email) {
      await pusherServer.trigger(currentUser?.email, "notification:off", false);
    }

    return NextResponse.json("Notifications off");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
