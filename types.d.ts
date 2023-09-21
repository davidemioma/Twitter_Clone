import { Comment, Post, User } from "@prisma/client";

export type CommentProps = Comment & {
  user: User;
};

export type PostProps = Post & {
  user: User;
  comments: CommentProps[];
};
