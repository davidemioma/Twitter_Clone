"use client";

import React, { useEffect, useState } from "react";
import Edit from "../modal/Edit";
import Login from "../modal/Login";
import { User } from "@prisma/client";
import Register from "../modal/Register";
import CreatePost from "../modal/CreatePost";
import Conversation from "../modal/Conversation";
import ImgModal from "../modal/ImgModal";

interface Props {
  currentUser: User | null;
}

const ModalProvider = ({ currentUser }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Login />

      <Register />

      <Edit currentUser={currentUser} />

      <CreatePost currentUser={currentUser} />

      <Conversation />

      <ImgModal />
    </>
  );
};

export default ModalProvider;
