"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import useLike from "@/hooks/useLike";
import { numberFormatter } from "@/lib/utils";
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from "react-icons/ai";

interface Props {
  currentUser: User | null;
  post: PostProps;
}

const PostBtns = ({ currentUser, post }: Props) => {
  const [commentCount, setCommentCount] = useState(0);

  const { hasLiked, likeCount, loading, toggleLike } = useLike({
    post,
    currentUser,
  });

  useEffect(() => {
    const getCount = async () => {
      const res = await axios.get(`/api/comments/count?id=${post.id}`);

      setCommentCount(res.data);
    };

    getCount();
  }, [post.id]);

  return (
    <div className="flex items-center gap-10 mt-3">
      <Link href={`/posts/${post.id}`}>
        <div className="flex items-center justify-center gap-2 text-neutral-500 cursor-pointer transition hover:text-sky-500">
          <AiOutlineMessage size={22} />

          <span>{numberFormatter(commentCount)}</span>
        </div>
      </Link>

      <div className="flex items-center justify-center gap-2 text-neutral-500 cursor-pointer transition hover:text-red-500">
        <button onClick={toggleLike} disabled={loading}>
          {hasLiked ? (
            <AiFillHeart size={22} className="text-red-500" />
          ) : (
            <AiOutlineHeart size={22} />
          )}
        </button>

        <span>{numberFormatter(likeCount)}</span>
      </div>
    </div>
  );
};

export default PostBtns;
