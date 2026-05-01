// components/messaging/chat-list.tsx
"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatThreadItem, type ChatThread } from "./chat-thread-item";
import { useChatThreads } from "@/hooks/use-chat-thread"; // ← real threads hook

interface ChatListProps {
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}

export function ChatList({ onSelect, selectedId: selectedIdProp }: ChatListProps) {
  const { threads, loading } = useChatThreads();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use prop if provided, otherwise fallback to URL or first thread
  const selectedId = selectedIdProp !== undefined 
    ? selectedIdProp 
    : (searchParams.get("conversationId") || threads[0]?.id);

  const handleSelect = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("conversationId", id);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto border-r border-white/10 p-4">
        <div className="h-16 w-full bg-gray-200 animate-pulse rounded mb-2" />
        <div className="h-16 w-full bg-gray-200 animate-pulse rounded mb-2" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-secondary/60 flex flex-col overflow-y-auto border-r border-white/10">
      {threads.map((thread) => (
        <ChatThreadItem
          key={thread.id}
          thread={thread}
          isSelected={selectedId === thread.id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}