"use client";

import React, { useState, useEffect } from "react";
import { ChatList } from "./chat-list";
import { RealtimeChat } from "./realtime-chat";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

interface ChatContainerProps {
  initialConversationId: string | null;
  currentUserId: string;
  initialUsername: string;
}

export function ChatContainer({
  initialConversationId,
  currentUserId,
  initialUsername,
}: ChatContainerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId);
  const [targetName, setTargetName] = useState("Select a Chat");
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync state to URL without reloading the server component
  const handleSelect = (id: string) => {
    setSelectedId(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("conversationId", id);
    // router.replace updates the URL in the browser, but our handleSelect 
    // update to selectedId ensures the UI changes instantly.
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    async function fetchTargetName() {
      if (!selectedId) return;

      const { data: conversation } = await supabase
        .from("chat_conversations")
        .select("seller_id, buyer_id")
        .eq("id", selectedId)
        .single();

      if (conversation) {
        const otherId =
          conversation.seller_id === currentUserId
            ? conversation.buyer_id
            : conversation.seller_id;

        const { data: otherUser } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", otherId)
          .single();

        if (otherUser) {
          setTargetName(`${otherUser.first_name} ${otherUser.last_name}`.trim());
        }
      }
    }

    fetchTargetName();
  }, [selectedId, currentUserId, supabase]);

  const roomName = selectedId ? `chat:${selectedId}` : null;

  return (
    <div className="flex flex-1 h-[75vh] bg-background rounded-2xl overflow-hidden shadow-xl mx-8 my-8 border border-white/10">
      <div className="w-80">
        <ChatList 
          onSelect={handleSelect} 
          selectedId={selectedId} 
        />
      </div>
      <div className="flex-1">
        {roomName ? (
          <RealtimeChat
            key={roomName}
            roomName={roomName}
            username={initialUsername}
            targetUser={{ name: targetName }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-primary/40">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xl font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
