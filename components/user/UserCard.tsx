import React from "react";
import Avatar from "../Avatar";
import FollowBtn from "./FollowBtn";
import { User } from "@prisma/client";
import { getProfileUser } from "@/app/actions/getProfileUser";

interface Props {
  currentUser: User | null;
  userId: string;
}

const UserCard = async ({ currentUser, userId }: Props) => {
  const user = await getProfileUser(userId);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5 p-4 hover:bg-neutral-900 transition">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar userId={user.id} imageUrl={user.profileImage} />

          <div className="flex flex-col">
            <span className="font-semibold">{user.name}</span>

            <span className="text-sm text-gray-500">@{user.username}</span>
          </div>
        </div>

        {currentUser && currentUser?.id !== user.id && (
          <FollowBtn currentUser={currentUser} user={user} />
        )}
      </div>

      <span className="ml-14 text-sm">{user.bio}</span>
    </div>
  );
};

export default UserCard;
