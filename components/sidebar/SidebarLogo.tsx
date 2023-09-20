"use client";

import React from "react";
import { BsTwitter } from "react-icons/bs";
import { useRouter } from "next/navigation";

const SidebarLogo = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center w-14 h-14 p-4 rounded-full cursor-pointer hover:bg-blue-300 hover:bg-opacity-10 transition"
      onClick={() => router.push("/")}
    >
      <BsTwitter size={28} color="#fff" />
    </div>
  );
};

export default SidebarLogo;
