"use client";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "@prisma/client";
import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { usePathname } from "next/navigation";
import SidebarTweetBtn from "./SidebarTweetBtn";
import { FaUser, FaRegUser } from "react-icons/fa";
import { IoMailOutline, IoMailSharp } from "react-icons/io5";
import { BsHouseFill, BsHouse, BsBell, BsBellFill } from "react-icons/bs";

interface Props {
  currentUser: User | null;
}

const Sidebar = ({ currentUser }: Props) => {
  const pathname = usePathname();

  const [hasNotification, setHasNotification] = useState(
    currentUser?.hasNotification
  );

  const pusherKey = useMemo(() => currentUser?.email, [currentUser?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const turnOnHandler = (hasNotification: boolean) => {
      setHasNotification(hasNotification);
    };

    const turnOffHandler = (hasNotification: boolean) => {
      setHasNotification(hasNotification);
    };

    pusherClient.bind("notification:on", turnOnHandler);

    pusherClient.bind("notification:off", turnOffHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);

      pusherClient.unbind("notification:on", turnOnHandler);

      pusherClient.unbind("notification:off", turnOffHandler);
    };
  }, [pusherKey]);

  const items = [
    {
      icon: BsHouse,
      activeIcon: BsHouseFill,
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      icon: BsBell,
      activeIcon: BsBellFill,
      label: "Notifications",
      href: "/notifications",
      auth: true,
      alert: hasNotification,
      active: pathname === "/notifications",
    },
    {
      icon: FaRegUser,
      activeIcon: FaUser,
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      auth: true,
      active: pathname === `/users/${currentUser?.id}`,
    },
    {
      icon: IoMailOutline,
      activeIcon: IoMailSharp,
      label: "Messages",
      href: "/messages",
      auth: true,
      active: pathname === "/messages",
    },
  ];

  return (
    <div className="col-sapn-1 h-full flex flex-col pr-4 md:pr-6">
      <div className="lg:w-[230px] flex flex-1 justify-end">
        <div className="flex flex-col gap-2">
          <SidebarLogo />

          {items.map((item) => (
            <SidebarItem
              key={item.label}
              currentUser={currentUser}
              Icon={item.icon}
              label={item.label}
              href={item.href}
              auth={item.auth}
              alert={item.alert}
              active={item.active}
              ActiveIcon={item.activeIcon}
            />
          ))}

          {currentUser && (
            <SidebarItem
              currentUser={currentUser}
              Icon={BiLogOut}
              label="Logout"
              ActiveIcon={BiLogOut}
              onClick={() => signOut()}
            />
          )}

          <SidebarTweetBtn currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
