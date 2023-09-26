"use client";

import React from "react";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  onChange: (value: string) => void;
}

const EmojiPicker = ({ onChange }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-sky-500" size={20} />
      </PopoverTrigger>

      <PopoverContent
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        side="right"
        sideOffset={-30}
      >
        <Picker
          data={data}
          theme="dark"
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
