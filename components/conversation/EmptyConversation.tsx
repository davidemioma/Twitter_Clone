"use client";

import React from "react";
import Button from "../Button";
import useConversationModal from "@/hooks/useConversationModal";

const EmptyConversation = () => {
  const converstionModal = useConversationModal();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-3xl font-extrabold">Welcome to your inbox!</h1>

      <p className="text-gray-500">
        Drop a line, share posts and more with private conversations between you
        and others on Twitter.
      </p>

      <Button
        label="Write a message"
        large
        onClick={() => converstionModal.onOpen()}
      />
    </div>
  );
};

export default EmptyConversation;
