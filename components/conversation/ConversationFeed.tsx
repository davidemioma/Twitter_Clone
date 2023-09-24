import React from "react";
import { ConversationProps } from "@/types";

interface Props {
  conversations: ConversationProps[];
}

const ConversationFeed = ({ conversations }: Props) => {
  return <div>ConversationFeed</div>;
};

export default ConversationFeed;
