import { createClient } from "@/utils/supabase/server";
import { ChatList } from "@/components/messaging/chat-list";
import { RealtimeChat } from "@/components/messaging/realtime-chat";
import { getChatRoomId } from "@/lib/utils";
import { Suspense } from "react";
import { redirect } from "next/navigation";

type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; id: string };
};

interface PageProps {
  searchParams: Promise<{ userId?: string; conversationId?: string }>;
}

export default async function ChatPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const conversationId = params.conversationId;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/sewer-center/chat");
  }

  // Get the current conversation if conversationId is provided
  let conversation = null;
  let otherId = null;
  let targetName = "Select a Chat";

  if (conversationId) {
    const { data, error: convErr } = await supabase
      .from("chat_conversations")
      .select("id, seller_id, buyer_id")
      .eq("id", conversationId)
      .single();
    
    if (data && !convErr) {
      conversation = data;
      // Figure out who is the other user
      otherId = conversation.seller_id === user.id
        ? conversation.buyer_id
        : conversation.seller_id;

      // Fetch the other user's name
      const { data: otherUser } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", otherId)
        .single();

      if (otherUser) {
        targetName = `${otherUser.first_name} ${otherUser.last_name}`.trim() || "Unknown User";
      } else {
        targetName = "Unknown User";
      }
    }
  }

  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const username =
    profile
      ? `${profile.first_name} ${profile.last_name}`
      : user.email || "Guest";

  const roomName = conversationId ? `chat:${conversationId}` : null;
  const initialMessages: ChatMessage[] = [];

  return (
    <div className="flex flex-1 h-[75vh] bg-background rounded-2xl overflow-hidden shadow-xl mx-8 my-8 border border-white/10">
      <Suspense fallback={<div className="w-80 animate-pulse bg-primary/5" />}>
        <ChatList />
      </Suspense>
      <div className="flex-1">
        {roomName ? (
          <RealtimeChat
            key={roomName}
            roomName={roomName}
            username={username}
            messages={initialMessages}
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