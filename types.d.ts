import { Notification, Post, User } from "@prisma/client";

export type PostProps = Post & {
  user: User;
};

export type NotificationProps = Notification & {
  user: User;
};
