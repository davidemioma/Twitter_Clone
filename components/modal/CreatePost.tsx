"use client";

import React from "react";
import { User } from "@prisma/client";
import usePostModal from "@/hooks/usePostModal";
import FormBody from "../form/FormBody";
import Modal from "./Modal";

interface Props {
  currentUser: User | null;
}

const CreatePost = ({ currentUser }: Props) => {
  const postModal = usePostModal();

  const bodyContent = (
    <div className="border-y border-neutral-800 py-4">
      <FormBody currentUser={currentUser} placeholder="What's happening?" />
    </div>
  );

  return (
    <Modal
      isOpen={postModal.isOpen}
      onClose={() => postModal.onClose()}
      body={bodyContent}
    />
  );
};

export default CreatePost;
