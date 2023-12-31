"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ImageUpload from "../input/ImageUpload";
import EmojiPicker from "../input/EmojiPicker";

interface Props {
  conversationId: string;
}

const MessageForm = ({ conversationId }: Props) => {
  const router = useRouter();

  const [body, setBody] = useState("");

  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (body.trim() === "" && image.trim() === "") return;

    setLoading(true);

    try {
      await axios.post("/api/messages/send", { conversationId, image, body });

      router.refresh();

      setBody("");

      setImage("");
    } catch (err: any) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-neutral-800">
      <form onSubmit={onSubmit} className="flex items-center gap-4">
        <ImageUpload
          forPost
          value={image}
          onChange={(image) => setImage(image)}
          disabled={loading}
        />

        <div className="flex-1 flex items-center gap-2 p-2 border border-neutral-800 rounded-full">
          <EmojiPicker
            onChange={(emoji) => setBody((prev) => `${prev} ${emoji}`)}
          />

          <input
            className="bg-transparent flex-1 text-sm outline-none border-none"
            type="text"
            placeholder="Write a message"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="hidden sm:inline text-sky-500 cursor-pointer disabled:opacity-75"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
