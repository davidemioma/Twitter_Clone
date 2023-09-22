"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../Avatar";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import PostBtns from "./PostBtns";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const PostItem = ({ currentUser, post }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-5 border-b border-neutral-800 cursor-pointer hover:bg-neutral-900 transition">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Avatar userId={post.user.id} imageUrl={post.user.profileImage} />

          <div className="flex flex-col">
            <Link href={`/users/${post.user.id}`}>
              <span className="font-semibold cursor-pointer hover:underline">
                {post.user.name}
              </span>
            </Link>

            <Link href={`/users/${post.user.id}`}>
              <span className="text-neutral-500 text-sm cursor-pointer hover:underline">
                @{post.user.username}
              </span>
            </Link>
          </div>
        </div>

        <span className="text-neutral-500 text-sm">
          {formatTimeToNow(new Date(post.createdAt))}
        </span>
      </div>

      <Link href={`/posts/${post.id}`}>
        <div className="mt-2">
          <div className="text-sm">{post.body}</div>

          {post.image && (
            <div className="relative w-full h-44 md:h-52 mt-2">
              <Image
                className="object-cover"
                fill
                src={post.image}
                alt="post_img"
              />
            </div>
          )}
        </div>
      </Link>

      {currentUser && <PostBtns currentUser={currentUser} post={post} />}
    </div>
  );
};

export default PostItem;
