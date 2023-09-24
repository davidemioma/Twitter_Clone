"use client";

import React from "react";
import { RiMailAddLine } from "react-icons/ri";
import useConversationModal from "@/hooks/useConversationModal";

const CreateBtn = () => {
  const conversationModal = useConversationModal();

  return (
    <button
      className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:bg-slate-900 hover:text-white transition"
      onClick={() => conversationModal.onOpen()}
    >
      <RiMailAddLine size={18} />
    </button>
  );
};

export default CreateBtn;
