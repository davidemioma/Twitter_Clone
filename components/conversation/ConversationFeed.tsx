import React from "react";
import { User } from "@prisma/client";
import { ConversationProps } from "@/types";
import ConversationCard from "./ConversationCard";

interface Props {
  currentUser: User | null;
  conversations: ConversationProps[];
}

const ConversationFeed = ({ currentUser, conversations }: Props) => {
  return (
    <>
      {conversations.map((conversation) => (
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
