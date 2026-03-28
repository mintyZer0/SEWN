import { createClient } from "@/utils/supabase/server";
import { ChatList } from "@/components/messaging/chat-list";
import { RealtimeChat } from "@/components/messaging/realtime-chat";
import { getChatRoomId } from "@/lib/utils";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ userId?: string }>;
}

export default async function ChatPage({ searchParams }: PageProps) {
  const { userId: selectedUserId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Default to first user if none selected
  const targetId = selectedUserId || "chini-1"; 

  // Get current user profile to get the name
  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", user?.id)
    .single();

  const username = profile ? `${profile.first_name} ${profile.last_name}` : user?.email || "Guest";

  // Deterministic room ID between these two users
  const roomName = getChatRoomId(user?.id || "", targetId);

  // Get target user name (mock data for demo)
  const targetName = targetId === "chini-1" ? "Chini De Bertha" 
                  : targetId === "chini-2" ? "Renerie Sews"
                  : targetId === "chini-3" ? "Maria Clara"
                  : "Juan Dela Cruz";

  // Mock initial messages
  const initialMessages = [
    {
      id: "1",
      content: `Hi! Welcome to my shop. I am ${targetName}`,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      user: { name: targetName }
    },
    {
      id: "2",
      content: "Thank you! I'm interested in your work.",
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      user: { name: username }
    }
  ];

  return (
    <div className="flex flex-1 h-[75vh] bg-background rounded-2xl overflow-hidden shadow-xl mx-8 my-8 border border-white/10">
      <Suspense fallback={<div className="w-80 animate-pulse bg-primary/5" />}>
        <ChatList />
      </Suspense>
      <div className="flex-1">
        <RealtimeChat 
          key={roomName} // Force re-mount when switching rooms
          roomName={roomName}
          username={username}
          messages={initialMessages as any}
          targetUser={{ name: targetName }}
        />
      </div>
    </div>
  );
}
