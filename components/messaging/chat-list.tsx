"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ChatThreadItem, type ChatThread } from "./chat-thread-item";

const mockThreads: ChatThread[] = [
  { id: "chini-1", name: "Chini De Bertha", lastMessage: "Ano po yun?", time: "Yesterday" },
  { id: "chini-2", name: "Renerie Sews", lastMessage: "Available po ba?", time: "Yesterday" },
  { id: "chini-3", name: "Maria Clara", lastMessage: "Thank you!", time: "2 days ago" },
  { id: "chini-4", name: "Juan Dela Cruz", lastMessage: "Magkano po?", time: "3 days ago" },
];

export function ChatList() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("userId") || mockThreads[0].id;

  return (
    <div className="w-80 bg-secondary/60 flex flex-col overflow-y-auto border-r border-white/10">
      {mockThreads.map((thread) => (
        <ChatThreadItem 
          key={thread.id} 
          thread={thread} 
          isSelected={selectedId === thread.id} 
        />
      ))}
    </div>
  );
}
