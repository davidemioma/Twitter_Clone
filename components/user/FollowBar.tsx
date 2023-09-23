"use client";

import React from "react";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  profileUser: User | null;
}

const FollowBar = ({ profileUser }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const items = [
    {
      id: 1,
      label: "Followers",
      link: `/users/${profileUser?.id}/followers`,
      active: pathname === `/users/${profileUser?.id}/followers`,
    },
    {
      id: 2,
      label: "Followings",
      link: `/users/${profileUser?.id}/followings`,
      active: pathname === `/users/${profileUser?.id}/followings`,
    },
  ];
  return (
    <div className="grid grid-cols-2 border-b border-neutral-800 pt-5">
      {items.map((item) => (
        <div
          key={item.id}
          className={`w-full flex items-center justify-center ${
            item.active
              ? "text-white border-b-4 border-sky-500"
              : "text-gray-500"
          } cursor-pointer pb-5 font-semibold`}
          onClick={() => router.push(item.link)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default FollowBar;
