"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
}

interface ChatListCompactProps {
  onSelect: (id: string) => void;
  selectedId?: string | null;
  threads: ChatThread[];
}

export function ChatListCompact({ onSelect, selectedId, threads }: ChatListCompactProps) {
  return (
    <div className="flex flex-col h-full bg-secondary/10 overflow-y-auto custom-scrollbar">
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onSelect(thread.id)}
          className={cn(
            "p-4 flex gap-3 cursor-pointer border-b border-primary/5 transition-all",
            selectedId === thread.id ? "bg-white/60 shadow-inner" : "hover:bg-white/30"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-primary text-md truncate leading-tight">
                {thread.name}
              </h4>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-sm font-medium text-primary/60 truncate leading-tight">
                {thread.lastMessage}
              </p>
              <span className="text-sm font-bold text-primary/40 shrink-0">
                {thread.time}
              </span>
            </div>


          </div>
        </div>
      ))}
    </div>
  );
}
