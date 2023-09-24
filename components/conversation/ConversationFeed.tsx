"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";
import { ConversationProps } from "@/types";
import ConversationCard from "./ConversationCard";

interface Props {
  currentUser: User | null;
  conversations: ConversationProps[];
}

const ConversationFeed = ({ currentUser, conversations }: Props) => {
  const [convos, setConvos] = useState<ConversationProps[]>(conversations);

  const pusherKey = useMemo(() => currentUser?.email, [currentUser?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: ConversationProps) => {
      setConvos((current) =>
        current.map((convo) => {
          if (convo.id === conversation.id) {
            return { ...convo, messages: conversation.messages };
          }

          return convo;
        })
      );
    };

    pusherClient.bind("conversation:update", updateHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);

      pusherClient.unbind("conversation:update", updateHandler);
    };
  }, [pusherKey]);

  return (
    <>
      {convos.map((conversation) => (
        <ConversationCard
          key={conversation.id}
          currentUser={currentUser}
          conversation={conversation}
        />
      ))}
    </>
  );
};

export default ConversationFeed;
