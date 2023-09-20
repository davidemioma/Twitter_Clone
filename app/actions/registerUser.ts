"use server";

import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";

interface Props {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  name,
  username,
  email,
  password,
}: Props) => {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    if (!username) {
      throw new Error("Username is required");
    }

    if (!email) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
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
  } catch (err: any) {
    throw new Error(`Failed to register user: ${err.message}`);
  }
};
