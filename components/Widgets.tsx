"use client";

import React from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import { User } from "@prisma/client";

interface Props {
  currentUser: User | null;
  suggestions: User[];
}

const Widgets = ({ currentUser, suggestions }: Props) => {
  if (suggestions?.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block px-6 py-4">
      <div className="bg-neutral-800 rounded-xl p-4">
        <h2 className="font-semibold">Who to follow</h2>

        <div className="flex flex-col gap-6 mt-4">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-4 justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar userId={user.id} imageUrl={user.profileImage} />

                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{user.name}</p>

                  <p className="text-sm text-neutral-400">@{user.username}</p>
                </div>
              </div>

              {currentUser && (
                <Button label="Follow" secondary onClick={() => {}} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Widgets;
