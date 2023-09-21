import React from "react";
import PostItem from "./PostItem";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import EmptyState from "../EmptyState";

interface Props {
  currentUser: User | null;
  posts: PostProps[];
}

const PostFeed = ({ posts, currentUser }: Props) => {
  if (posts.length === 0) {
    return <EmptyState label="No posts available" />;
  }

  return (
    <>
      {posts.map((post: any) => (
        <PostItem key={post.id} currentUser={currentUser} post={post} />
      ))}
    </>
  );
};

export default PostFeed;
