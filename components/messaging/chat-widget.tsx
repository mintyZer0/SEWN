"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, ChevronLeft } from "lucide-react";
import { cn, getChatRoomId } from "@/lib/utils";
import { ChatListCompact } from "./chat-list-compact";
import { RealtimeChat } from "./realtime-chat";
import { createClient } from "@/utils/supabase/client";
import { useIsDesktop } from "@/hooks/use-is-desktop";

const mockThreads = [
  { id: "chini-1", name: "Chini De Bertha", lastMessage: "Ano po yun?", time: "Yesterday" },
  { id: "chini-2", name: "Aling Maria", lastMessage: "Sige po!", time: "Yesterday" },
  { id: "chini-3", name: "Rhea Villanueva", lastMessage: "Ang bibili ka o hindi?", time: "Yesterday" },
];

interface ChatWidgetProps {
  initialUsername?: string;
}

export function ChatWidget({ initialUsername = "Guest" }: ChatWidgetProps) {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"list" | "chat">("list");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(mockThreads[0].id);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [username, setUsername] = useState(initialUsername);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUsername(`${profile.first_name} ${profile.last_name}`);
        } else {
          setUsername(user.email || "User");
        }
      }
    };
    fetchUser();
  }, [supabase]);

  if (pathname?.startsWith("/sewer-center")) return null;

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    if (!isDesktop) setView("chat");
  };

  const targetName = mockThreads.find(t => t.id === selectedUserId)?.name || "User";
  const roomName = getChatRoomId(currentUserId || "guest", selectedUserId || "default");

  const initialMessages = selectedUserId ? [
    {
      id: "w1",
      content: `Hello! I'm ${targetName}. How can I help?`,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      user: { name: targetName }
    },
    {
      id: "w2",
      content: "I have a question about my order.",
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      user: { name: username }
    }
  ] : [];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-jost">
      {isOpen && (
        <div className={cn(
          "mb-4 bg-background rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300",
          "w-96 h-136 lg:w-200 lg:h-150"
        )}>
          {/* Header */}
          <div className="bg-orchid-vertical-b p-5 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              {view === "chat" && !isDesktop ? (
                <button 
                  onClick={() => setView("list")}
                  className="hover:bg-white/20 p-1 rounded-full transition-colors active:scale-95"
                >
                  <ChevronLeft className="size-6" />
                </button>
              ) : (
                <MessageSquare className="size-6" />
              )}
              <h3 className="text-xl font-black">
                {isDesktop ? `Chat (${mockThreads.length})` : (view === "list" ? `Chat (${mockThreads.length})` : targetName)}
              </h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors active:scale-95"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {isDesktop ? (
              <>
                <div className="w-1/3 border-r border-primary/5">
                  <ChatListCompact 
                    onSelect={handleSelectUser} 
                    selectedId={selectedUserId}
                    threads={mockThreads}
                  />
                </div>
                <div className="flex-1">
                  <RealtimeChat 
                    key={roomName}
                    roomName={roomName}
                    username={username}
                    variant="compact"
                    targetUser={{ name: targetName }}
                    messages={initialMessages as any}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full">
                {view === "list" ? (
                  <ChatListCompact 
                    onSelect={handleSelectUser} 
                    selectedId={selectedUserId}
                    threads={mockThreads}
                  />
                ) : (
                  <RealtimeChat 
                    key={roomName}
                    roomName={roomName}
                    username={username}
                    variant="compact"
                    targetUser={{ name: targetName }}
                    messages={initialMessages as any}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
          "bg-orchid-vertical-b text-white"
        )}
      >
        {isOpen ? <X className="size-8" /> : <MessageSquare className="size-8" />}
      </button>
    </div>
  );
}
