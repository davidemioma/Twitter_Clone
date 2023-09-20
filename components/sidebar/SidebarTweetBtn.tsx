import React from "react";
import { User } from "@prisma/client";
import { FaFeather } from "react-icons/fa";

interface Props {
  currentUser: User | null;
}

const SidebarTweetBtn = () => {
  const onClickHandler = () => {};

  return (
    <div className="cursor-pointer mt-4" onClick={onClickHandler}>
      <div className="bg-sky-500 flex items-center justify-center w-14 h-14 p-4 rounded-full transition hover:bg-opacity-80 lg:hidden">
        <FaFeather size={24} color="#fff" />
      </div>

      <div className="hidden lg:block bg-sky-500 px-4 py-2 rounded-full transition hover:bg-opacity-90">
        <p className="text-center font-semibold">Tweet</p>
      </div>
    </div>
  );
};

export default SidebarTweetBtn;
