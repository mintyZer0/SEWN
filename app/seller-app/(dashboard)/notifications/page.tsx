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
  const supabase = createClient();
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
    async function fetchSewerStatus() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // 2. Fetch Orders (Order Items belonging to this seller's products)
        const { data: orderItemsData } = await supabase
          .from('order_items')
          .select(`
            id,
            orders!inner (
              created_at,
              users (
                first_name,
                last_name
              )
            ),
            seller_products!inner (
              name,
              user_id
            )
          `)
          .eq('seller_products.user_id', user.id);

        // 3. Fetch Commissions
        const { data: commissionsData } = await supabase
          .from('service_requests')
          .select(`
            id,
            created_at,
            client_id,
            users!service_requests_client_id_fkey (
              first_name,
              last_name
            )
          `)
          .eq('sewer_id', user.id)
          .eq('service_type', 'commission')
          .order('created_at', { ascending: false });

        // Format Notifications
        const formattedNotifications: StatusItem[] = (notificationsData || []).map(n => ({
          id: n.id,
          title: n.title,
          description: n.message || "",
          timestamp: formatDate(n.created_at),
          type: "notification",
          link: n.action_link
        }));

        // Format Orders
        // Note: orderItemsData.orders.users might be an array or single object depending on PostgREST setup.
        // We'll handle both cases safely.
        let formattedOrders: StatusItem[] = (orderItemsData || []).map((item: any) => {
          const order = Array.isArray(item.orders) ? item.orders[0] : item.orders;
          const customer = order?.users ? (Array.isArray(order.users) ? order.users[0] : order.users) : null;
          const product = Array.isArray(item.seller_products) ? item.seller_products[0] : item.seller_products;
          
          const customerName = customer ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim() : "Customer";
          
          return {
            id: item.id,
            title: `${customerName} bought ${product?.name || "a product"}!`,
            description: "Click to go to products summary",
            timestamp: formatDate(order?.created_at),
            type: "order",
          };
        });

        // Sort orders by timestamp descending manually since we fetched via join
        formattedOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Format Commissions
        const formattedCommissions: StatusItem[] = (commissionsData || []).map((c: any) => {
           const client = Array.isArray(c.users) ? c.users[0] : c.users;
           const clientName = client ? `${client.first_name || ""} ${client.last_name || ""}`.trim() : "Customer";
           return {
            id: c.id,
            title: `${clientName} would like to commission you!`,
            description: "Click to check details",
            timestamp: formatDate(c.created_at),
            type: "commission",
          };
        });

        setData({
          notifications: formattedNotifications,
          orders: formattedOrders,
          commissions: formattedCommissions,
        });

      } catch (error) {
        console.error("Error fetching status:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSewerStatus();
  }, [supabase]);

  return (
    <div className="p-16 max-w-6xl mx-auto">
      <StatusSection title="Notifications" items={data.notifications} loading={loading} />
      <StatusSection title="Orders" items={data.orders} loading={loading} />
      <StatusSection title="Commissions" items={data.commissions} loading={loading} />
    </div>
  );
}
