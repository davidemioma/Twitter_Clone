"use client";

import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Image from "next/image";
import Button from "../Button";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import useSearchedUsers from "@/hooks/useSearchedUsers";
import useConversationModal from "@/hooks/useConversationModal";

const Conversation = () => {
  const router = useRouter();

  const conversationModal = useConversationModal();

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const { results } = useSearchedUsers(searchQuery);

  const onClickHandler = async (userId: string) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/conversations/create", { userId });

      router.refresh();

      router.push(`/messages/${res.data.id}`);

      conversationModal.onClose();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <div>
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-2">
        <FiSearch className="text-sky-500" size={20} />

        <input
          className="bg-transparent flex-1 border-0 outline-none text-sm"
          value={searchQuery}
          type="text"
          placeholder="Search people"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        {results.map((user) => (
          <div key={user.id} className="flex items-center gap-3 py-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                className="object-cover"
                src={user.profileImage || "/assets/no-user.gif"}
                fill
                alt=""
              />
            </div>

            <div className="flex flex-1 flex-col">
              <span className="font-semibold">{user.name}</span>

              <span className="text-sm text-gray-500">@{user.username}</span>
            </div>

            <Button
              label="Message"
              disabled={loading}
              onClick={() => onClickHandler(user.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={conversationModal.isOpen}
      onClose={() => conversationModal.onClose()}
      title="New Message"
      body={bodyContent}
    />
  );
};

export default Conversation;
