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
  initialPosts: PostProps[];
}

const PostFeed = ({ initialPosts, currentUser }: Props) => {
  const { ref, entry, data, fetchNextPage, isFetchingNextPage } =
    useUnlimitedScrolling({
      key: "post-feed",
      query: `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}`,
      initialData: initialPosts,
    });

  //@ts-ignore
  const posts: PostProps[] =
    data?.pages?.flatMap((page) => page) ?? initialPosts;

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  if (posts?.length === 0) {
    return <EmptyState label="No posts available" />;
  }

  return (
    <>
      <>
        {posts?.map((post, i) => {
          if (i === posts.length - 1) {
            return (
              <div key={post.id} ref={ref}>
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
