// hooks/useRealtimeChat.ts
import { useEffect, useState } from "react";
import { RealtimeChannel, RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    id: string;
  };
}

interface UseRealtimeChatOptions {
  roomName: string;
  username: string;
}

export function useRealtimeChat({ roomName, username }: UseRealtimeChatOptions) {
  const supabase = createClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  let channel: RealtimeChannel | null = null;

  // Load existing messages from DB
  useEffect(() => {
    const loadMessages = async () => {
      const match = roomName.match(/^chat:(.*)$/);
      if (!match) return;
      const conversationId = match[1];

      const { data: dbMessages, error } = await supabase
        .from("chat_messages")
        .select("id, content, created_at, from_user_id")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load chat history:", error);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const myUserId = user?.id;

      const mapped: ChatMessage[] = dbMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        user: {
          name: msg.from_user_id === myUserId ? username : "Seller",
          id: msg.from_user_id,
        },
      }));

      setMessages(mapped);
    };

    loadMessages();
  }, [roomName, username]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const match = roomName.match(/^chat:(.*)$/);
    if (!match) return;
    const conversationId = match[1];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: messageData, error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        from_user_id: user.id,
        to_user_id: "placeholder", // you can fill this later from DB
        content: text,
      })
      .select("id, content, created_at, from_user_id");

    if (error) {
      console.error("Failed to send message:", error);
      return;
    }

    const msg = messageData[0];
    setMessages((prev) => [
      ...prev,
      {
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        user: {
          name: username,
          id: msg.from_user_id,
        },
      },
    ]);
  };

  // Realtime subscription
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const match = roomName.match(/^chat:(.*)$/);
      if (!match) return;
      const conversationId = match[1];

      channel = supabase
        .channel(`chat:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload: RealtimePostgresInsertPayload<any>) => {
            const record = payload.new;
            const isOwn = record.from_user_id === user.id;

            setMessages((prev) => [
              ...prev,
              {
                id: record.id,
                content: record.content,
                createdAt: record.created_at,
                user: {
                  name: isOwn ? username : "Seller",
                  id: record.from_user_id,
                },
              },
            ]);
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") setIsConnected(true);
        });
    };

    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomName, username, supabase]);

  return { messages, sendMessage, isConnected };
}