"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="bg-white rounded-[30px] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden shrink-0">
      {/* Image/Icon Slot */}
      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center border-2 border-gray-50">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <User className="w-10 h-10 text-gray-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-24">
        <h4 className="text-2xl font-bold text-third truncate leading-tight">
          {item.title}
        </h4>
        <p className="text-lg text-gray-500 font-medium mt-1">
          {item.description}
        </p>
      </div>

      {/* Timestamp - Bottom Right */}
      <div className="absolute bottom-4 right-6">
        <span className="text-xs font-bold text-gray-400/80 uppercase tracking-tighter">
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
    <div className="third-gradient rounded-[50px] p-10 mb-12 shadow-inner border-t-4 border-white/20 min-h-[300px] flex flex-col">
      <h3 className="text-5xl font-bold text-white mb-8 tracking-tight drop-shadow-sm">
        {title}
      </h3>
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-white/80 gap-4">
            <Loader2 className="w-12 h-12 animate-spin" />
            <span className="text-2xl font-medium">Loading {title.toLowerCase()}...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <StatusCard key={item.id} item={item} />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-white/60">
            <span className="text-2xl font-medium italic">No {title.toLowerCase()} found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    notifications: StatusItem[];
    orders: StatusItem[];
    commissions: StatusItem[];
  }>({
    notifications: [],
    orders: [],
    commissions: [],
  });

  useEffect(() => {
    async function fetchSewerStatus() {
      try {
        setLoading(true);
        // TODO: Replace with actual Supabase fetching
        // const { data: notificationsData } = await supabase.from('notifications').select('*')...
        
        // Simulating fetch delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data to show the layout while you connect the DB
        setData({
          notifications: Array(3).fill(null).map((_, i) => ({
            id: `n-${i}`,
            title: "Hard Concrete is now approved!",
            description: "Congrats sewer! Your product is now active!",
            timestamp: "15/02/26 8:40PM",
            type: "notification",
          })),
          orders: Array(2).fill(null).map((_, i) => ({
            id: `o-${i}`,
            title: "(Customer Name) bought Hard Concrete!",
            description: "Click to go to products summary",
            timestamp: "15/02/26 8:40PM",
            type: "order",
          })),
          commissions: Array(2).fill(null).map((_, i) => ({
            id: `c-${i}`,
            title: "(Customer Name) would like to commission you!",
            description: "Click to check details",
            timestamp: "15/02/26 8:40PM",
            type: "commission",
          })),
        });
      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSewerStatus();
  }, []);

  return (
    <div className="p-16 max-w-6xl mx-auto">
      <StatusSection title="Notifications" items={data.notifications} loading={loading} />
      <StatusSection title="Orders" items={data.orders} loading={loading} />
      <StatusSection title="Commissions" items={data.commissions} loading={loading} />
    </div>
  );
}
