"use client";

import React, { useEffect, useState } from "react";
import Edit from "../modal/Edit";
import Login from "../modal/Login";
import { User } from "@prisma/client";
import Register from "../modal/Register";
import CreatePost from "../modal/CreatePost";

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
    </>
  );
};

export default ModalProvider;
