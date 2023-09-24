"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ConversationProps } from "@/types";
import { formatTimeToNow } from "@/lib/utils";

interface Props {
  currentUser: User | null;
  conversation: ConversationProps;
}

const ConversationCard = ({ currentUser, conversation }: Props) => {
  const router = useRouter();

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === currentUser?.id ? memberTwo : memberOne;

  //Getting the last message
  const lastMessage = useMemo(() => {
    const lastMessage =
      conversation?.messages?.[conversation?.messages?.length - 1];

    return lastMessage;
  }, [conversation?.messages]);

  //Returns a text depending on the last message
  const text = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  //Checking if current user has seen the message
  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArr = lastMessage?.seenIds || [];

    if (!currentUser) return false;

    return seenArr.findIndex((id) => id === currentUser.id) !== -1;
  }, [currentUser, lastMessage]);

  return (
    <div
      onClick={() => router.push(`/messages/${conversation.id}`)}
      className="flex items-center gap-3 p-6 hover:bg-neutral-900 transition cursor-pointer"
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          className="object-cover"
          src={otherMember.profileImage || "/assets/no-user.gif"}
          fill
          alt=""
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{otherMember.name}</span>

          <span className="text-sm text-gray-500">@{otherMember.username}</span>
        </div>

        <span
          className={`text-sm ${
            hasSeen ? "text-gray-500" : "text-white"
          } truncate`}
        >
          {text}
        </span>
      </div>

      {lastMessage && (
        <span className="text-xs text-gray-500 font-light">
          {formatTimeToNow(new Date(lastMessage?.createdAt))}
        </span>
      )}
    </div>
  );
};

export default ConversationCard;
