// hooks/useChatThreads.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { getS3PublicUrl } from "@/lib/s3-client";

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  last_message_at?: string;
}

const CHAT_THREADS_CACHE_VERSION = 1;
const CHAT_THREADS_LAST_CACHE_KEY = "chat-threads-last-cache";

type ChatThreadsCachePayload = {
  version: number;
  cachedAt: number;
  threads: ChatThread[];
};

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const hasBootDataRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const readThreadsCache = useCallback((userId: string): ChatThreadsCachePayload | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(`chat-threads-cache:${userId}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as ChatThreadsCachePayload;
      if (parsed.version !== CHAT_THREADS_CACHE_VERSION) return null;
      return parsed;
    } catch (error) {
      console.error("Failed to parse chat threads cache:", error);
      return null;
    }
  }, []);

  const readLatestThreadsCache = useCallback((): ChatThreadsCachePayload | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(CHAT_THREADS_LAST_CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as ChatThreadsCachePayload;
      if (parsed.version !== CHAT_THREADS_CACHE_VERSION) return null;
      return parsed;
    } catch (error) {
      console.error("Failed to parse latest chat threads cache:", error);
      return null;
    }
  }, []);

  const writeThreadsCache = useCallback((userId: string, nextThreads: ChatThread[]) => {
    if (typeof window === "undefined") return;
    const payload: ChatThreadsCachePayload = {
      version: CHAT_THREADS_CACHE_VERSION,
      cachedAt: Date.now(),
      threads: nextThreads,
    };
    window.localStorage.setItem(`chat-threads-cache:${userId}`, JSON.stringify(payload));
    window.localStorage.setItem(CHAT_THREADS_LAST_CACHE_KEY, JSON.stringify(payload));
  }, []);

  const loadThreads = useCallback(async () => {
    const supabase = createClient();
    setLoading(!hasBootDataRef.current);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    userIdRef.current = user.id;

    const cached = readThreadsCache(user.id);
    if (cached?.threads?.length) {
      setThreads(cached.threads);
      hasBootDataRef.current = true;
      setLoading(false);
    }

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select(`
        id, 
        buyer_id, 
        sewist_id, 
        last_message_at,
        chat_messages (
          content,
          created_at
        )
      `)
      .or(`buyer_id.eq.${user.id},sewist_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Sidebar: Failed to load conversations:", error);
      setLoading(false);
      return;
    }

    const recipientIds = [...new Set(conversations.map((c: any) => c.buyer_id === user.id ? c.sewist_id : c.buyer_id))];
    
    const { data: usersData } = await supabase
      .from("users")
      .select("id, first_name, last_name, user_avatars(avatar_url)")
      .in("id", recipientIds);
      
    const usersMap = new Map(usersData?.map(u => {
      const avatarData = u.user_avatars;
      const avatarUrl = Array.isArray(avatarData) ? (avatarData as any[])[0]?.avatar_url : (avatarData as any)?.avatar_url;
      const avatar = getS3PublicUrl(avatarUrl || "/assets/sewist-photos/1.jpg");
      return [u.id, {
        name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || `User ${u.id.substring(0,8)}`,
        avatar
      }];
    }) || []);

    const mapped = conversations.map((c: any) => {
      const recipientId = c.buyer_id === user.id ? c.sewist_id : c.buyer_id;
      const userInfo = usersMap.get(recipientId) || { name: `User ${recipientId.substring(0, 8)}`, avatar: getS3PublicUrl("/assets/sewist-photos/1.jpg") };
      
      const sortedMessages = (c.chat_messages || []).sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const lastMsg = sortedMessages[0]?.content || "No messages yet";

      return {
        id: c.id,
        name: userInfo.name,
        lastMessage: lastMsg,
        last_message_at: c.last_message_at,
        time: c.last_message_at
          ? new Date(c.last_message_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : "New Chat",
        avatar: userInfo.avatar,
      };
    });

    setThreads(mapped);
    writeThreadsCache(user.id, mapped);
    hasBootDataRef.current = true;
    setLoading(false);
  }, [readThreadsCache, writeThreadsCache]);

  useEffect(() => {
    const latest = readLatestThreadsCache();
    if (latest?.threads?.length) {
      setThreads(latest.threads);
      hasBootDataRef.current = true;
      setLoading(false);
    }
  }, [readLatestThreadsCache]);

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
          setThreads((prev) => {
            const updated = prev.map((t) => 
              t.id === newMsg.conversation_id 
                ? { ...t, lastMessage: newMsg.content } 
                : t
            );
            if (userIdRef.current) {
              writeThreadsCache(userIdRef.current, updated);
            }
            return updated;
          });
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
