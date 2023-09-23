"use client";

import React from "react";
import { User } from "@prisma/client";
import WidgetItem from "./WidgetItem";

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
            <WidgetItem
              key={user.id}
              currentUser={currentUser}
              profileUser={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Widgets;
