"use client";

import React from "react";
import Image from "next/image";
import Avatar from "../Avatar";
import { User } from "@prisma/client";

interface Props {
  user: User | null;
}

const UserHero = ({ user }: Props) => {
  return (
    <div>
      <div className="relative bg-neutral-700 h-44">
        {user?.coverImage && (
          <Image
            className="object-cover"
            src={user.coverImage}
            fill
            alt="cover image"
          />
        )}

        <div className="absolute -bottom-12 left-4">
          <Avatar
            userId={user?.id!}
            imageUrl={user?.profileImage!}
            isLarge
            hasBorder
          />
        </div>
      </div>
    </div>
  );
};

export default UserHero;
