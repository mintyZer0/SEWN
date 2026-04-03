"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, ChevronLeft } from "lucide-react";
import { cn, getChatRoomId } from "@/lib/utils";
import { ChatListCompact } from "./chat-list-compact";
import { RealtimeChat } from "./realtime-chat";
import { createClient } from "@/utils/supabase/client";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useChatThreads } from "@/hooks/use-chat-thread";

interface ChatWidgetProps {
  initialUsername?: string;
  setIsOpen?: (Open: boolean) => void;
}

export function ChatWidget({ initialUsername = "Guest", setIsOpen: setIsOpenExternal }: ChatWidgetProps) {
  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const isOpen = setIsOpenExternal ? Boolean(setIsOpenExternal) : isOpenLocal;
  const setIsOpen = setIsOpenExternal ?? setIsOpenLocal;
  const [view, setView] = useState<"list" | "chat">("list");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [username, setUsername] = useState(initialUsername);
  const supabase = createClient();

  const { threads, loading } = useChatThreads();

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
      setIsCheckingUser(false);
    };

    fetchUser();

    // Auto‑select first real conversation if none selected
    if (!selectedConversationId && !loading && threads.length > 0) {
      setSelectedConversationId(threads[0].id);
    }
  }, [supabase, threads, loading, selectedConversationId]);

  if (pathname?.startsWith("/sewer-center") || pathname?.startsWith("/auth")) return null;
  if (isCheckingUser || !currentUserId) return null;

  const handleSelectUser = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (!isDesktop) setView("chat");
  };

  const target =
    threads.find((t) => t.id === selectedConversationId) ||
    (threads.length > 0 ? threads[0] : null);
  const targetName = target?.name || "User";

  const initialMessages: any[] = [];

  const roomName = selectedConversationId
    ? `chat:${selectedConversationId}`
    : "chat:default";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-jost">
      {isOpen && (
        <div
          className={cn(
            "mb-4 bg-background rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300",
            "w-96 h-136 lg:w-200 lg:h-150"
          )}
        >
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
                {isDesktop
                  ? `Chat (${threads.length})`
                  : view === "list"
                  ? `Chat (${threads.length})`
                  : targetName}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors active:scale-95"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {isDesktop ? (
              <>
                <div className="w-1/3 border-r border-primary/5">
                  <ChatListCompact
                    onSelect={handleSelectUser}
                    selectedId={selectedConversationId}
                    threads={threads}
                  />
                </div>
                <div className="flex-1">
                  <RealtimeChat
                    key={roomName}
                    roomName={roomName}
                    username={username}
                    variant="compact"
                    targetUser={{ name: targetName }}
                    messages={initialMessages}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full">
                {view === "list" ? (
                  <ChatListCompact
                    onSelect={handleSelectUser}
                    selectedId={selectedConversationId}
                    threads={threads}
                  />
                ) : (
                  <RealtimeChat
                    key={roomName}
                    roomName={roomName}
                    username={username}
                    variant="compact"
                    targetUser={{ name: targetName }}
                    messages={initialMessages}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

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