"use client";

import React from "react";
import Image from "next/image";
import Avatar from "../Avatar";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { formatTimeToNow } from "@/lib/utils";
import { AiOutlineMessage, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useLike from "@/hooks/useLike";
import useCommentCount from "@/hooks/useCommentCount";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const PostItem = ({ currentUser, post }: Props) => {
  const router = useRouter();

  const { commentCount } = useCommentCount(post.id);

  const { hasLiked, likeCount, loading, toggleLike } = useLike({
    post,
    currentUser,
  });

  return (
    <div className="p-5 border-b border-neutral-800 cursor-pointer hover:bg-neutral-900 transition">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Avatar userId={post.user.id} imageUrl={post.user.profileImage} />

          <div className="flex flex-col">
            <span
              className="font-semibold cursor-pointer hover:underline"
              onClick={() => router.push(`/users/${post.user.id}`)}
            >
              {post.user.name}
            </span>

            <span
              className="text-neutral-500 text-sm cursor-pointer hover:underline"
              onClick={() => router.push(`/users/${post.user.id}`)}
            >
              @{post.user.username}
            </span>
          </div>
        </div>

        <span className="text-neutral-500 text-sm">
          {formatTimeToNow(new Date(post.createdAt))}
        </span>
      </div>

      <div className="mt-2" onClick={() => router.push(`/posts/${post.id}`)}>
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

      <div className="flex items-center gap-10 mt-3">
        <button
          className="flex items-center justify-center gap-2 text-neutral-500 cursor-pointer transition hover:text-sky-500"
          onClick={() => router.push(`/posts/${post.id}`)}
        >
          <AiOutlineMessage size={22} />

          <p>{commentCount}</p>
        </button>

        <button
          className="flex items-center justify-center gap-2 text-neutral-500 cursor-pointer transition hover:text-red-500"
          onClick={toggleLike}
          disabled={loading}
        >
          {hasLiked ? (
            <AiFillHeart size={22} className="text-red-500" />
          ) : (
            <AiOutlineHeart size={22} />
          )}

          <p>{likeCount}</p>
        </button>
      </div>
    </div>
  );
};

export default PostItem;
