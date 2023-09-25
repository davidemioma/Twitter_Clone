"use client";

import React, { useEffect, useMemo, useState } from "react";
import { find } from "lodash";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import EmptyState from "../EmptyState";
import { NotificationProps } from "@/types";
import { pusherClient } from "@/lib/pusher";
import { turnOffNotification } from "@/app/actions/turnOffNotification";

interface Props {
  currentUser: User | null;
  notifications: NotificationProps[];
}

const NotificationsContent = ({ currentUser, notifications }: Props) => {
  const [allNotifications, setAllNotifications] = useState(notifications);

  const pusherKey = useMemo(() => currentUser?.email, [currentUser?.email]);

  useEffect(() => {
    const turnOff = async () => {
      await turnOffNotification();
    };

    turnOff();
  }, []);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (notification: NotificationProps) => {
      setAllNotifications((current) => {
        if (find(current, { id: notification.id })) {
          return current;
        }

        return [notification, ...current];
      });
    };

    pusherClient.bind("notification:new", newHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);

      pusherClient.unbind("notification:new", newHandler);
    };
  }, [pusherKey]);

  if (allNotifications.length === 0) {
    return <EmptyState label="You have no new notification" />;
  }

  return (
    <div className="flex flex-col">
      {allNotifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center gap-4 p-6 border-b border-neutral-800"
        >
          <Avatar
            userId={notification.user.id}
            imageUrl={notification.user.image}
          />

          <p className="text-sm">{notification.body}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsContent;
