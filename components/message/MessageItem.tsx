"use client";

import React from "react";
import Image from "next/image";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import { MessageProps } from "@/types";
import { formatTimeToNow } from "@/lib/utils";

interface Props {
  currentUser: User | null;
  message: MessageProps;
}

const MessageItem = ({ currentUser, message }: Props) => {
  if (!message || !message.user) {
    return null;
  }

  return (
    <div
      className={`flex ${
        currentUser?.id === message.user?.id && "justify-end"
      } px-6 py-2`}
    >
      <div className="flex gap-3">
        <div className={`${currentUser?.id === message.user?.id && "order-2"}`}>
          <Avatar
            userId={message.user?.id}
            imageUrl={message.user?.profileImage}
          />
        </div>

        <div
          className={`flex flex-col gap-2 ${
            currentUser?.id === message.user?.id && "items-end"
          }`}
        >
          <p className="text-sm text-gray-500">{message.user?.name}</p>

          <p className="text-sm text-gray-400">
            {formatTimeToNow(new Date(message.createdAt))}
          </p>

          {message.body && (
            <p
              className={`${
                currentUser?.id === message.user.id
                  ? "bg-sky-500 text-white"
                  : "bg-neutral-50 text-black"
              } text-sm w-fit rounded-full px-3 py-2`}
            >
              {message.body}
            </p>
          )}

          {message.image && (
            <div className="relative w-[250px] h-[250px] rounded-md overflow-hidden">
              <Image
                className="object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                src={message.image}
                fill
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
