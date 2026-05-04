"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export type NotificationType =
  | "notification"
  | "order"
  | "commission"
  | "alteration"
  | "repair"
  | "promotion"
  | "appointment";

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionLink: string | null;
  createdAt: string;
}

const DEFAULT_NOTIFICATION_TYPE: NotificationType = "notification";

function normalizeNotificationType(value: unknown): NotificationType {
  if (
    value === "order" ||
    value === "commission" ||
    value === "alteration" ||
    value === "repair" ||
    value === "promotion" ||
    value === "appointment" ||
    value === "notification"
  ) {
    return value;
  }
  return DEFAULT_NOTIFICATION_TYPE;
}

function normalizeNotificationRow(row: Record<string, unknown>): NotificationItem {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: typeof row.title === "string" ? row.title : "",
    message: typeof row.message === "string" ? row.message : "",
    type: normalizeNotificationType(row.type),
    isRead: Boolean(row.is_read),
    actionLink: typeof row.action_link === "string" ? row.action_link : null,
    createdAt: typeof row.created_at === "string" ? row.created_at : new Date(0).toISOString(),
  };
}

export function useNotifications() {
  const supabase = useMemo(() => createClient(), []);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Failed to resolve current user for notifications:", userError);
      setError("Failed to resolve current user.");
      setNotifications([]);
      setUserId(null);
      setLoading(false);
      return;
    }

    if (!user) {
      setNotifications([]);
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error: fetchError } = await supabase
      .from("notifications")
      .select("id, user_id, title, message, type, is_read, action_link, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Failed to fetch notifications:", fetchError);
      setError(fetchError.message);
      setNotifications([]);
      setLoading(false);
      return;
    }

    const normalized = (data ?? []).map((row) => normalizeNotificationRow(row));
    setNotifications(normalized);
    setLoading(false);
  }, [supabase]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!userId) return;

      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", userId)
        .eq("is_read", false);

      if (updateError) {
        throw updateError;
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    },
    [supabase, userId]
  );

  const markAllAsRead = useCallback(
    async (types?: NotificationType[]) => {
      if (!userId) return;

      let request = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (types && types.length > 0) {
        request = request.in("type", types);
      }

      const { error: updateError } = await request;
      if (updateError) {
        throw updateError;
      }

      const typeSet = new Set(types ?? []);
      setNotifications((prev) =>
        prev.map((notification) => {
          if (notification.isRead) return notification;
          if (typeSet.size > 0 && !typeSet.has(notification.type)) return notification;
          return { ...notification, isRead: true };
        })
      );
    },
    [supabase, userId]
  );

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = normalizeNotificationRow(payload.new as Record<string, unknown>);
          setNotifications((prev) => {
            if (prev.some((notification) => notification.id === incoming.id)) return prev;
            return [incoming, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = normalizeNotificationRow(payload.new as Record<string, unknown>);
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === incoming.id ? incoming : notification
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, notification) => count + (notification.isRead ? 0 : 1), 0),
    [notifications]
  );

  const unreadByType = useMemo(() => {
    return notifications.reduce(
      (acc, notification) => {
        if (!notification.isRead) {
          acc[notification.type] += 1;
        }
        return acc;
      },
      {
        notification: 0,
        order: 0,
        commission: 0,
        alteration: 0,
        repair: 0,
        promotion: 0,
        appointment: 0,
      } as Record<NotificationType, number>
    );
  }, [notifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    unreadByType,
    markAsRead,
    markAllAsRead,
    reload: loadNotifications,
  };
}
