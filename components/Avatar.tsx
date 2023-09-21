"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  imageUrl: string | null;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar = ({ userId, imageUrl, isLarge, hasBorder }: Props) => {
  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(`/users/${userId}`);
  }, [router, userId]);

  return (
    <div
      className={`relative ${isLarge ? "h-24 w-24" : "h-12 w-12"} ${
        hasBorder && "border-4 border-black"
      } rounded-full cursor-pointer transition hover:opacity-90 flex-shrink-0`}
    >
      <Image
        className="rounded-full object-cover"
        src={imageUrl || "/assets/no-user.gif"}
        fill
        alt="Avatar"
        onClick={onClick}
      />
    </div>
  );
};

export default Avatar;
