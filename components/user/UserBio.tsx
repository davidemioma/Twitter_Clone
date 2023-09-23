"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "../Button";
import { User } from "@prisma/client";
import useFollow from "@/hooks/useFollow";
import { BiCalendar } from "react-icons/bi";
import { pusherClient } from "@/lib/pusher";
import useEditModal from "@/hooks/useEditModal";
import { formatTimeToNow, numberFormatter } from "@/lib/utils";

interface Props {
  currentUser: User | null;
  profileUser: User | null;
}

const UserBio = ({ currentUser, profileUser }: Props) => {
  const editModal = useEditModal();

  const [followersCount, setFollowersCount] = useState<number>(
    profileUser?.followersIds?.length || 0
  );

  const { loading, isFollowing, toggleFollow } = useFollow({
    currentUser,
    profileUser,
  });

  const pusherKey = useMemo(() => profileUser?.email, [profileUser?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newFollower = (followersCount: number) => {
      setFollowersCount(followersCount);
    };

    const removeFollower = (followersCount: number) => {
      setFollowersCount(followersCount);
    };

    pusherClient.bind("follower:new", newFollower);

    pusherClient.bind("follower:unfollow", removeFollower);

    return () => {
      pusherClient.unsubscribe(pusherKey);

      pusherClient.unbind("follower:new", newFollower);

      pusherClient.unbind("follower:unfollow", removeFollower);
    };
  }, [pusherKey]);

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
              <Button
                label={isFollowing ? "Unfollow" : "Follow"}
                secondary={!isFollowing}
                outline={isFollowing}
                onClick={toggleFollow}
                disabled={loading}
              />
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
          <Link href={`/users/${profileUser?.id}/followings`}>
            <div className="flex items-center gap-1 text-sm">
              <p>{numberFormatter(profileUser?.followingsIds?.length || 0)}</p>

              <p className="text-neutral-500">Following</p>
            </div>
          </Link>

          <Link href={`/users/${profileUser?.id}/followers`}>
            <div className="flex items-center gap-1 text-sm">
              <p>{numberFormatter(followersCount || 0)}</p>

              <p className="text-neutral-500">Followers</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
