"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface StatusItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  image?: string;
  type: "notification" | "order" | "commission";
  link?: string;
}

const StatusCard = ({ item }: { item: StatusItem }) => {
  return (
    <div className="bg-white rounded-2xl md:rounded-[30px] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden shrink-0">
      {/* Image/Icon Slot */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center border-2 border-gray-50">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 64px, 80px"
            className="object-cover"
          />
        ) : (
          <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 md:pr-24">
        <h4 className="text-xl md:text-2xl font-bold text-third truncate leading-tight">
          {item.title}
        </h4>
        <p className="text-sm md:text-lg text-gray-500 font-medium mt-1">
          {item.description}
        </p>
      </div>

      {/* Timestamp - Bottom Right */}
      <div className="static mt-2 md:absolute md:bottom-4 md:right-6 w-full md:w-auto text-right">
        <span className="text-[10px] md:text-xs font-bold text-gray-400/80 uppercase tracking-tighter">
          {item.timestamp}
        </span>
      </div>
    </div>
  );
};

const StatusSection = ({ 
  title, 
  items, 
  loading 
}: { 
  title: string; 
  items: StatusItem[]; 
  loading: boolean 
}) => {
  return (
    <div className="third-gradient rounded-3xl md:rounded-[50px] p-6 md:p-10 mb-8 md:mb-12 shadow-inner border-t-4 border-white/20 min-h-[300px] flex flex-col">
      <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 tracking-tight drop-shadow-sm text-center md:text-left">
        {title}
      </h3>
      <div className="space-y-4 md:space-y-6 max-h-[400px] md:max-h-[600px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-12 text-white/80 gap-4">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin" />
            <span className="text-xl md:text-2xl font-medium">Loading {title.toLowerCase()}...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <StatusCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-8 md:py-12 text-white/60">
            <span className="text-xl md:text-2xl font-medium italic">No {title.toLowerCase()} found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    notifications: StatusItem[];
  }>({
    notifications: [],
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${dd}/${mm}/${yy} ${hours}:${minutes}${ampm}`;
  };

  useEffect(() => {
    async function fetchSewistStatus() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all notifications from the single table
        const { data: notificationsData, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Format all notifications uniformly
        const formattedNotifications: StatusItem[] = (notificationsData || []).map(n => ({
          id: n.id,
          title: n.title,
          description: n.message || "",
          timestamp: formatDate(n.created_at),
          type: (n.type as "notification" | "order" | "commission") || "notification",
          link: n.action_link
        }));

        setData({
          notifications: formattedNotifications,
        });

      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSewistStatus();
  }, [supabase]);

  const generalNotifs = data.notifications.filter(n => n.type === "notification");
  const orderNotifs = data.notifications.filter(n => n.type === "order");
  const commissionNotifs = data.notifications.filter(n => n.type === "commission");

  return (
    <div className="p-4 md:p-16 pb-32 md:pb-16 max-w-6xl mx-auto">
      <StatusSection title="Notifications" items={generalNotifs} loading={loading} />
      <StatusSection title="Orders" items={orderNotifs} loading={loading} />
      <StatusSection title="Commissions" items={commissionNotifs} loading={loading} />
    </div>
  );
}
