import React from "react";
import { PostProps } from "@/types";
import { User } from "@prisma/client";
import PostItem from "./post/PostItem";

interface Props {
  currentUser: User | null;
  comments: PostProps[];
}

const CommentFeed = ({ currentUser, comments }: Props) => {
  return (
    <>
      {comments.map((comment) => (
        <PostItem key={comment.id} currentUser={currentUser} post={comment} />
      ))}
    </>
  );
};

export default CommentFeed;
