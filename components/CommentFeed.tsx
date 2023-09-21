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
  comments: PostProps[];
}

const CommentFeed = ({ currentUser, postId, comments }: Props) => {
  const { ref, entry, data, fetchNextPage, isFetchingNextPage } =
    useUnlimitedScrolling({
      key: "infinite-comments-feed",
      query: `/api/comments?postId=${postId}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
      initialData: comments,
    });

  //@ts-ignore
  const newComments: PostProps[] =
    data?.pages?.flatMap((page) => page) ?? comments;

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <>
      <>
        {newComments.map((comment, i) => {
          if (i === newComments.length - 1) {
            return (
              <div ref={ref} key={comment.id}>
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
