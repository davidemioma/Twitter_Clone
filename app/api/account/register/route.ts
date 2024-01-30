import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/register";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    const { name, username, email, password } = registerSchema.parse(reqBody);

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!username) {
      return new NextResponse("Username is required", { status: 400 });
    }

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismadb.user.create({
      data: {
        name,
        username,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json("Account created");
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
