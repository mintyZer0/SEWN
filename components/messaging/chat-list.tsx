// components/messaging/chat-list.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ChatThreadItem, type ChatThread } from "./chat-thread-item";
import { useChatThreads } from "@/hooks/use-chat-thread"; // ← real threads hook

export function ChatList() {
  const { threads, loading } = useChatThreads();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("conversationId") || threads[0]?.id;

  if (loading) {
    return (
      <div className="w-80 flex flex-col overflow-y-auto border-r border-white/10 p-4">
        <div className="h-16 w-full bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-16 w-full bg-gray-200 animate-pulse rounded mb-2" />
      </div>
    );
  }

  return (
    <div className="w-80 bg-secondary/60 flex flex-col overflow-y-auto border-r border-white/10">
      {threads.map((thread) => (
        <ChatThreadItem
          key={thread.id}
          thread={thread}
          isSelected={selectedId === thread.id}
        />
      ))}
    </div>
  );
}