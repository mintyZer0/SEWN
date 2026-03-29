// hooks/useChatThreads.ts
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThreads = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: conversations, error } = await supabase
        .from("chat_conversations")
        .select("id, buyer_id, seller_id, last_message_at")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);

      if (error) {
        console.error("Failed to load conversations:", error);
        setLoading(false);
        return;
      }

      const mapped = conversations.map((c) => {
        const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;

        return {
          id: c.id,
          name: `Sewer ${otherId.substring(0, 8)}`, // you can replace with real user name later
          lastMessage: "", // real last message text; empty until you join with chat_messages
          time: c.last_message_at
            ? new Date(c.last_message_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
            : "Just now",
        };
      });

      setThreads(mapped);
      setLoading(false);
    };

    loadThreads();
  }, []);

  return { threads, loading };
}