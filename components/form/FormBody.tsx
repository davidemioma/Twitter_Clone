"use client";

import React, { useState } from "react";
import axios from "axios";
import Avatar from "../Avatar";
import Button from "../Button";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import ImageUpload from "../input/ImageUpload";
import EmojiPicker from "../input/EmojiPicker";
import usePostModal from "@/hooks/usePostModal";

interface Props {
  currentUser: User | null;
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const FormBody = ({ currentUser, placeholder, isComment, postId }: Props) => {
  const [body, setBody] = useState("");

  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  const postModal = usePostModal();

  const resetForm = () => {
    setBody("");

    setImage("");

    postModal.isOpen && postModal.onClose();
  };

  const onSubmit = async () => {
    setLoading(true);

    try {
      if (isComment && postId) {
        await axios.post("/api/comments/create", { postId, body, image });

        toast.success("Comment created");
      } else {
        await axios.post("/api/posts/create", { body, image });

        toast.success("Tweet created");
      }

      resetForm();

      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <Avatar userId={currentUser?.id!} imageUrl={currentUser?.profileImage!} />

      <div className="mt-3 flex-1 flex flex-col">
        <textarea
          className="bg-black w-full peer ring-0 resize-none outline-none placeholder-neutral-500 disabled:opacity-80"
          placeholder={placeholder}
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
        />

        <hr className="w-full h-[1px] mb-4 border-neutral-800 opacity-0 peer-focus:opacity-100" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageUpload
              forPost
              value={image}
              onChange={(image) => setImage(image)}
              disabled={loading}
            />

            <EmojiPicker
              onChange={(emoji) => setBody((prev) => `${prev} ${emoji}`)}
            />
          </div>

          <Button
            label="Tweet"
            onClick={onSubmit}
            disabled={!body.trim() || loading}
          />
        </div>
      </div>
    </div>
  );
};

export default FormBody;
