import {
  Conversation,
  Message,
  Notification,
  Post,
  User,
} from "@prisma/client";

export type PostProps = Post & {
  user: User;
};

export type NotificationProps = Notification & {
  user: User;
};

export type ConversationProps = Conversation & {
  memberOne: User;
  memberTwo: User;
  messages: Message[];
};

export type MessageProps = Message & {
  user: User;
};
