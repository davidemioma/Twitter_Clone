"use client";

import React, { useRef, ElementRef, Fragment } from "react";
import { User } from "@prisma/client";
import { MessageProps } from "@/types";
import MessageItem from "./MessageItem";
import useChatSocket from "@/hooks/useChatSocket";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { useChatScroll } from "@/hooks/useChatScroll";

interface Props {
  currentUser: User | null;
  conversationId: string;
}

const MessagesBody = ({ currentUser, conversationId }: Props) => {
  const queryKey = `chat:${conversationId}`;

  const chatRef = useRef<ElementRef<"div">>(null);

  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, conversationId });

  useChatSocket({ pusherKey: conversationId, queryKey });

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages.length ?? 0,
  });

  if (status === "loading") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Loader2 className="h-7 w-7 text-sky-500 animate-spin my-4" />

        <p className="text-xs text-gray-500 ">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <ServerCrash className="h-7 w-7 text-sky-500 my-4" />

        <p className="text-xs text-gray-500 ">No new message!</p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="w-full h-full flex flex-col py-4 overflow-y-auto"
    >
      {!hasNextPage && <div className="flex-1" />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 my-4 text-gray-500 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="my-4 text-sm text-gray-500 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group?.messages.map((message: MessageProps) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUser={currentUser}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
};

export default MessagesBody;
