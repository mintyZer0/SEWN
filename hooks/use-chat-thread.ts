// hooks/useChatThreads.ts
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  last_message_at?: string;
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select(`
        id, 
        buyer_id, 
        seller_id, 
        last_message_at,
        chat_messages (
          content,
          created_at
        )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Sidebar: Failed to load conversations:", error);
      setLoading(false);
      return;
    }

    const mapped = conversations.map((c: any) => {
      const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
      
      const sortedMessages = (c.chat_messages || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastMsg = sortedMessages[0]?.content || "No messages yet";

      return {
        id: c.id,
        name: `User ${otherId.substring(0, 8)}`,
        lastMessage: lastMsg,
        last_message_at: c.last_message_at,
        time: c.last_message_at
          ? new Date(c.last_message_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : "New Chat",
      };
    });

    setThreads(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    loadThreads();

    const channel = supabase
      .channel(`sidebar-global-${Math.random()}`)
      // 1. Listen for new messages to update the PREVIEW text instantly
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new;
          setThreads((prev) => 
            prev.map((t) => 
              t.id === newMsg.conversation_id 
                ? { ...t, lastMessage: newMsg.content } 
                : t
            )
          );
        }
      )
      // 2. Listen for conversation updates to RE-ORDER the list
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_conversations' },
        () => {
          // Small delay to let the DB settle before re-ordering
          setTimeout(loadThreads, 150);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadThreads]);

  return { threads, loading };
}
