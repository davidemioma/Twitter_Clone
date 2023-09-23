"use client";

import React from "react";
import { User } from "@prisma/client";
import useFollow from "@/hooks/useFollow";
import Button from "../Button";

interface Props {
  currentUser: User | null;
  user: User;
}

const FollowBtn = ({ currentUser, user }: Props) => {
  const { loading, isFollowing, toggleFollow } = useFollow({
    currentUser,
    profileUser: user,
  });

  return (
    <Button
      label={isFollowing ? "Unfollow" : "Follow"}
      secondary={!isFollowing}
      outline={isFollowing}
      onClick={toggleFollow}
      disabled={loading}
    />
  );
};

export default FollowBtn;
