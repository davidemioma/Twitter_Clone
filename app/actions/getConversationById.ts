"use server";

import prismadb from "@/lib/prismadb";

export const getConversationById = async (id: string) => {
  try {
    if (!id) {
      return null;
    }

    const conversation = await prismadb.conversation.findUnique({
      where: {
        id,
      },
      include: {
        memberOne: true,
        memberTwo: true,
      },
    });

    return conversation;
  } catch (err) {
    return null;
  }
};
