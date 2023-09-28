import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(0);
    }

    const count = await prismadb.post.count({
      where: {
        parentId: id,
      },
    });

    return NextResponse.json(count);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
