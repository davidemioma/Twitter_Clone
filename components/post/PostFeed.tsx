"use client";

import React, { useEffect } from "react";
import Spinner from "../Spinner";
import PostItem from "./PostItem";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import EmptyState from "../EmptyState";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/lib/utils";
import useUnlimitedScrolling from "@/hooks/useUnlimitedScrolling";

interface Props {
  currentUser: User | null;
  posts: PostProps[];
}

const PostFeed = ({ posts, currentUser }: Props) => {
  const { ref, entry, data, fetchNextPage, isFetchingNextPage } =
    useUnlimitedScrolling({
      key: "infinite-post-feed",
      query: `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
      initialData: posts,
    });

  //@ts-ignore
  const newPosts: PostProps[] = data?.pages?.flatMap((page) => page) ?? posts;

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (newPosts.length === 0) {
    return <EmptyState label="No posts available" />;
  }

  return (
    <>
      <>
        {newPosts.map((post, i) => {
          if (i === newPosts.length - 1) {
            return (
              <div ref={ref} key={post.id}>
                <PostItem currentUser={currentUser} post={post} />
              </div>
            );
          } else {
            return (
              <PostItem key={post.id} currentUser={currentUser} post={post} />
            );
          }
        })}
      </>

      {isFetchingNextPage && <Spinner />}
    </>
  );
};

export default PostFeed;
