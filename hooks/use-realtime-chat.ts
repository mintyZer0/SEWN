// hooks/useRealtimeChat.ts
import { useEffect, useState, useRef } from "react";
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

// Simple global cache to store messages for each conversationId
const messageCache: Record<string, ChatMessage[]> = {};

export function useRealtimeChat({ roomName, username }: UseRealtimeChatOptions) {
  const supabase = createClient();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load existing messages from DB
  useEffect(() => {
    const loadMessages = async () => {
      const match = roomName.match(/^chat:(.*)$/);
      if (!match) return;
      const conversationId = match[1];

      // 1. Immediately set messages from cache if available for instant UI update
      if (messageCache[conversationId]) {
        setMessages(messageCache[conversationId]);
      } else {
        setMessages([]); // Clear list while loading if not in cache
      }

      const { data: dbMessages, error } = await supabase
        .from("chat_messages")
        .select("id, content, created_at, from_user_id")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load chat history:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const myUserId = user?.id;

      const mapped: ChatMessage[] = dbMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        createdAt: msg.created_at,
        user: {
          name: msg.from_user_id === myUserId ? username : "Sewist",
          id: msg.from_user_id,
        },
      }));

      // 2. Update cache and state with fresh data from DB
      messageCache[conversationId] = mapped;
      setMessages(mapped);
    };

    loadMessages();
  }, [roomName, username]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const match = roomName.match(/^chat:(.*)$/);
    if (!match) {
      console.error("Invalid roomName format:", roomName);
      return;
    }
    const conversationId = match[1];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user.");
      return;
    }

    // --- OPTIMISTIC UI START ---
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      content: text,
      createdAt: new Date().toISOString(),
      user: {
        name: username,
        id: user.id,
      },
    };

    // Show message immediately
    setMessages((prev) => {
      const updated = [...prev, optimisticMsg];
      messageCache[conversationId] = updated;
      return updated;
    });
    // --- OPTIMISTIC UI END ---

    // Load conversation to get buyer_id / sewist_id
    const { data: conversation, error: convErr } = await supabase
      .from("chat_conversations")
      .select("id, buyer_id, sewist_id")
      .eq("id", conversationId)
      .single();

    if (convErr || !conversation) {
      console.error("Failed to load conversation:", convErr);
      return;
    }

    const myId = user.id;
    const otherId =
      conversation.sewist_id === myId
        ? conversation.buyer_id
        : conversation.sewist_id;

    const { data: messageData, error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        from_user_id: myId,
        to_user_id: otherId,
        content: text,
      })
      .select("id, content, created_at, from_user_id");

    if (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message if send failed
      setMessages((prev) => prev.filter(m => m.id !== optimisticId));
      return;
    }

    // Update the conversation's timestamp to push it to the top of the list
    const { error: updateErr } = await supabase
      .from("chat_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateErr) {
      console.error("Failed to update conversation timestamp:", updateErr);
    }

    // Replace optimistic message with real message from DB
    const msg = messageData[0];
    const realMsg: ChatMessage = {
      id: msg.id,
      content: msg.content,
      createdAt: msg.created_at,
      user: {
        name: username,
        id: msg.from_user_id,
      },
    };

    setMessages((prev) => {
      const updated = prev.map(m => m.id === optimisticId ? realMsg : m);
      messageCache[conversationId] = updated;
      return updated;
    });
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const match = roomName.match(/^chat:(.*)$/);
      if (!match) return;
      const conversationId = match[1];

      // Cleanup existing channel before creating a new one
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const newChannel = supabase
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
            
            // Ignore if it's our own message (already handled by optimistic UI)
            if (record.from_user_id === user.id) return;

            const newMsg: ChatMessage = {
              id: record.id,
              content: record.content,
              createdAt: record.created_at,
              user: {
                name: "Sewist",
                id: record.from_user_id,
              },
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              const updated = [...prev, newMsg];
              messageCache[conversationId] = updated; // Update cache
              return updated;
            });
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setIsConnected(false);
          }
        });

      channelRef.current = newChannel;
    };

    init();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomName, username, supabase]);

  return { messages, sendMessage, isConnected };
}
