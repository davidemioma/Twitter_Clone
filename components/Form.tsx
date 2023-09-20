"use client";

import React from "react";
import Button from "./Button";
import { User } from "@prisma/client";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";

interface Props {
  currentUser: User | null;
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const Form = ({ currentUser, placeholder, isComment, postId }: Props) => {
  const loginModal = useLoginModal();

  const registerModal = useRegisterModal();

  return (
    <div className="px-5 py-2 border-b border-neutral-800">
      {currentUser ? (
        <div></div>
      ) : (
        <div className="py-8">
          <h2 className="text-center font-bold text-xl md:text-2xl mb-3">
            Welcome to Twitter
          </h2>

          <div className="flex items-center justify-center gap-3">
            <Button label="Login" onClick={() => loginModal.onOpen()} />

            <Button
              label="Register"
              onClick={() => registerModal.onOpen()}
              secondary
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
