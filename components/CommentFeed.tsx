"use client";

import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import PostItem from "./post/PostItem";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";
import useUnlimitedScrolling from "@/hooks/useUnlimitedScrolling";

interface Props {
  currentUser: User | null;
  postId: string;
  initialComments: PostProps[];
}

const CommentFeed = ({ currentUser, postId, initialComments }: Props) => {
  const { ref, entry, data, fetchNextPage, isFetchingNextPage } =
    useUnlimitedScrolling({
      key: "comments-feed",
      query: `/api/comments?postId=${postId}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
      initialData: initialComments,
    });

  //@ts-ignore
  const comments: PostProps[] =
    data?.pages?.flatMap((page) => page) ?? initialComments;

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <>
      <>
        {comments?.map((comment, i) => {
          if (i === comments.length - 1) {
            return (
              <div key={comment.id} ref={ref}>
                <PostItem currentUser={currentUser} post={comment} />
              </div>
            );
          } else {
            return (
              <PostItem
                key={comment.id}
                currentUser={currentUser}
                post={comment}
              />
            );
          }
        })}
      </>

      {isFetchingNextPage && <Spinner />}
    </>
  );
};

export default CommentFeed;
