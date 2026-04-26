// components/messaging/chat-thread-item.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
}

interface ChatThreadItemProps {
  thread: ChatThread;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ChatThreadItem = ({ thread, isSelected, onSelect }: ChatThreadItemProps) => {
  return (
    <div
      onClick={() => onSelect(thread.id)}
      className={cn(
        "p-5 flex gap-4 cursor-pointer transition-all hover:bg-secondary/80",
        isSelected ? "bg-third/20 shadow-inner" : ""
      )}
    >
      <div className="w-14 h-14 rounded-full bg-white/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-primary text-lg truncate leading-tight">
            {thread.name}
          </h4>
          <span className="text-[10px] font-bold text-primary/40 uppercase mt-1">
            {thread.time}
          </span>
        </div>
        <p className="text-sm font-medium text-primary/60 truncate -mt-1">
          {thread.lastMessage.startsWith("s3-private://") 
            ? (/\.(mp4|webm|ogg|mov)$/i.test(thread.lastMessage) ? "Video 🎥" : "Photo 📸")
            : thread.lastMessage}
        </p>
      </div>
    </div>
  );
};