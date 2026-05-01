"use client";

import React, { useState, useEffect } from "react";
import { ChatList } from "./chat-list";
import { RealtimeChat } from "./realtime-chat";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { getS3PublicUrl } from "@/lib/s3-client";
import { cn } from "@/lib/utils";

interface ChatContainerProps {
  initialConversationId: string | null;
  currentUserId: string;
  initialUsername: string;
  isSewistApp?: boolean;
}

export function ChatContainer({
  initialConversationId,
  currentUserId,
  initialUsername,
  isSewistApp = false,
}: ChatContainerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId);
  const [targetName, setTargetName] = useState("Select a Chat");
  const [targetAvatar, setTargetAvatar] = useState<string | undefined>(undefined);
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
        .select("sewist_id, buyer_id")
        .eq("id", selectedId)
        .single();

      if (conversation) {
        const otherId =
          conversation.sewist_id === currentUserId
            ? conversation.buyer_id
            : conversation.sewist_id;

        const { data: otherUser } = await supabase
          .from("users")
          .select("first_name, last_name, user_avatars(avatar_url)")
          .eq("id", otherId)
          .single();

        if (otherUser) {
          setTargetName(`${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || `User ${otherId.substring(0,8)}`);
          const avatarData = otherUser.user_avatars;
          const avatarUrl = Array.isArray(avatarData) ? (avatarData as any[])[0]?.avatar_url : (avatarData as any)?.avatar_url;
          setTargetAvatar(getS3PublicUrl(avatarUrl || "/assets/sewist-photos/1.jpg"));
        }
      }
    }

    fetchTargetName();
  }, [selectedId, currentUserId, supabase]);

  const roomName = selectedId ? `chat:${selectedId}` : null;

  // Lock body scroll when chat room is active on mobile to prevent the background page from scrolling
  useEffect(() => {
    if (roomName && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [roomName]);

  // On mobile, if a room is open, we use fixed inset-0 to cover the whole screen (including banner/nav)
  // this happens INSTANTLY because it's based on local state, not waiting for the server/URL.
  return (
    <div className={cn(
      "flex flex-col md:flex-row flex-1 min-h-0",
      // Use z-index that covers the header (z-1001) but stays within reasonable bounds
      roomName 
        ? "fixed inset-0 z-[1100] md:static md:w-full md:h-full md:max-h-[85vh]" 
        : "w-full h-full md:max-h-[85vh]",
      "bg-secondary md:bg-background rounded-none md:rounded-2xl overflow-hidden shadow-none md:shadow-xl md:mx-8 md:my-8 border-none md:border border-primary/10 relative"
    )}>
      <div className={cn("w-full md:w-80 h-full min-h-0 flex-shrink-0 border-r border-primary/5", roomName ? "hidden md:block" : "block")}>
        <ChatList 
          onSelect={handleSelect} 
          selectedId={selectedId} 
        />
      </div>
      <div className={cn("flex-1 h-full flex flex-col relative bg-secondary md:bg-transparent min-h-0", !roomName ? "hidden md:flex" : "flex")}>
        {roomName && (
          <div className="md:hidden bg-transparent border-b border-primary/20 mx-4 py-4 pt-8 flex items-center gap-3 shrink-0">
             <button 
               onClick={() => {
                 setSelectedId(null);
                 const params = new URLSearchParams(searchParams.toString());
                 params.delete("conversationId");
                 router.replace(`?${params.toString()}`, { scroll: false });
               }}
               className="p-1 hover:bg-black/5 rounded-full transition-colors text-primary"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
             {targetAvatar ? (
               <img src={targetAvatar} alt={targetName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-primary/10 shadow-sm" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0" />
             )}
             <span className="font-bold text-lg text-primary-dark truncate">{targetName}</span>
          </div>
        )}
        
        {roomName ? (
          <RealtimeChat
            key={roomName}
            roomName={roomName}
            username={initialUsername}
            targetUser={{ name: targetName, avatar: targetAvatar }}
            isSewistApp={isSewistApp}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-primary/40 bg-gray-50 md:bg-transparent">
            <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-center px-4">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
