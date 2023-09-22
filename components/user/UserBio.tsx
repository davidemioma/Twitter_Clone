"use client";

import React from "react";
import Button from "../Button";
import { User } from "@prisma/client";
import { BiCalendar } from "react-icons/bi";
import { formatTimeToNow } from "@/lib/utils";
import useEditModal from "@/hooks/useEditModal";

interface Props {
  currentUser: User | null;
  profileUser: User | null;
}

const UserBio = ({ currentUser, profileUser }: Props) => {
  const editModal = useEditModal();

  return (
    <div className="pb-4 border-b border-neutral-800">
      <div className="flex justify-end p-2 pr-4">
        {currentUser ? (
          <>
            {currentUser?.id === profileUser?.id ? (
              <Button
                label="Edit"
                secondary
                onClick={() => editModal.onOpen()}
              />
            ) : (
              <Button label="Follow" onClick={() => {}} />
            )}
          </>
        ) : (
          <div className="py-4" />
        )}
      </div>

      <div className="px-4 mt-2">
        <div className="flex flex-col">
          <p className="font-semibold">{profileUser?.name}</p>

          <p className="text-sm text-neutral-500">@{profileUser?.username}</p>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {profileUser?.bio && <p>{profileUser?.bio}</p>}

          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <BiCalendar size={24} />

            <p>Joined {formatTimeToNow(new Date(profileUser?.createdAt!))}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <p>{0}</p>

            <p className="text-neutral-500">Following</p>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <p>{0}</p>

            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
