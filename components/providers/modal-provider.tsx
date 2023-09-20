"use client";

import React, { useEffect, useState } from "react";
import Login from "../modal/Login";
import Register from "../modal/Register";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Login />

      <Register />
    </>
  );
};

export default ModalProvider;
