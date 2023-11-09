"use client";

import React from "react";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  onChange: (value: string) => void;
}

const EmojiPickerComponent = ({ onChange }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile className="text-sky-500 cursor-pointer" size={20} />
      </PopoverTrigger>

      <PopoverContent
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        // side="right"
        // sideOffset={-30}
      >
        <EmojiPicker
          height={350}
          // @ts-ignore
          theme="dark"
          onEmojiClick={(data) => onChange(data.emoji)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerComponent;
