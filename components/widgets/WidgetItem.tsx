"use client";

import React from "react";
import Avatar from "../Avatar";
import Button from "../Button";
import { User } from "@prisma/client";
import useFollow from "@/hooks/useFollow";

interface Props {
  currentUser: User | null;
  profileUser: User;
}

const WidgetItem = ({ currentUser, profileUser }: Props) => {
  const { loading, isFollowing, toggleFollow } = useFollow({
    currentUser,
    profileUser,
  });

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-3">
        <Avatar userId={profileUser.id} imageUrl={profileUser.profileImage} />

        <div className="flex flex-col">
          <p className="text-sm font-semibold">{profileUser.name}</p>

          <p className="text-sm text-neutral-400">@{profileUser.username}</p>
        </div>
      </div>

      {currentUser && currentUser.id !== profileUser.id && (
        <Button
          label={isFollowing ? "Unfollow" : "Follow"}
          secondary={!isFollowing}
          outline={isFollowing}
          onClick={toggleFollow}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default WidgetItem;
