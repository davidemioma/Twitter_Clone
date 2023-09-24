import { Conversation, Notification, Post, User } from "@prisma/client";

export type PostProps = Post & {
  user: User;
};

export type NotificationProps = Notification & {
  user: User;
};

export type ConversationProps = Conversation & {
  memberOne: User;
  memberTwo: User;
};
