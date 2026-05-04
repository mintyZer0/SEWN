"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNotifications, type NotificationItem } from "@/hooks/use-notifications";
import { createClient } from "@/utils/supabase/client";
import {
  ServiceRequestDetailsModal,
  type ServiceRequest,
} from "@/components/modals/service-request-details-modal";

interface StatusItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  image?: string;
  type:
    | "notification"
    | "order"
    | "commission"
    | "alteration"
    | "repair"
    | "promotion"
    | "appointment";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const StatusCard = ({ item, onOpen }: { item: StatusItem; onOpen: (item: StatusItem) => void }) => {
  return (
    <div
      onClick={() => onOpen(item)}
      className="bg-white rounded-2xl md:rounded-[30px] p-3 sm:p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 shadow-sm hover:shadow-md transition-all active:scale-95 group cursor-pointer relative overflow-hidden shrink-0"
    >
      {/* Image/Icon Slot */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gray-100 flex-shrink-0 relative overflow-hidden flex items-center justify-center border-2 border-gray-50">
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
        <h4 className="text-base sm:text-lg md:text-2xl font-bold text-third whitespace-normal break-words md:truncate leading-tight">
          {item.title}
        </h4>
        <p className="text-xs sm:text-sm md:text-lg text-gray-500 font-medium mt-1">
          {item.description}
        </p>
      </div>

      {/* Timestamp - Bottom Right */}
      <div className="static mt-1 md:absolute md:bottom-4 md:right-6 w-full md:w-auto text-left md:text-right">
        <span className="text-[10px] md:text-xs font-bold text-gray-400/80 uppercase tracking-tighter">
          {item.timestamp}
        </span>
        {!item.isRead ? (
          <span className="ml-2 md:ml-0 md:mt-1 inline-block w-2 h-2 rounded-full bg-third" />
        ) : null}
      </div>
    </div>
  );
};

const StatusSection = ({
  title,
  items,
  loading,
  onOpen,
}: {
  title: string;
  items: StatusItem[];
  loading: boolean;
  onOpen: (item: StatusItem) => void;
}) => {
  return (
    <div className="third-gradient rounded-2xl md:rounded-[50px] p-4 sm:p-6 md:p-10 mb-4 md:mb-12 shadow-inner border-t-4 border-white/20 min-h-0 md:min-h-[300px] flex flex-col">
      <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-8 tracking-tight drop-shadow-sm text-left">
        {title}
      </h3>
      <div className="space-y-3 md:space-y-6 max-h-none md:max-h-[600px] overflow-visible md:overflow-y-auto pr-0 md:pr-4 custom-scrollbar flex flex-col flex-1">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-12 text-white/80 gap-3 md:gap-4">
            <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin" />
            <span className="text-base md:text-2xl font-medium">Loading {title.toLowerCase()}...</span>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <StatusCard key={item.id} item={item} onOpen={onOpen} />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-12 text-white/60">
            <span className="text-base md:text-2xl font-medium italic">No {title.toLowerCase()} found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [allServiceRequests, setAllServiceRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const loadServiceRequests = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return;

    const { data: requestsData, error } = await supabase
      .from("service_requests")
      .select(`
        id,
        client_id,
        address_id,
        service_type,
        subject,
        request_details,
        appointment_date,
        status,
        created_at,
        measurement_profile_id,
        users!service_requests_client_id_fkey (
          first_name,
          last_name,
          email
        ),
        user_addresses!service_requests_address_id_fkey (
          full_address,
          barangay,
          city,
          province,
          zip_code,
          contact_name,
          contact_phone
        )
      `)
      .eq("sewist_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load service requests for notifications:", error);
      return;
    }

    const normalizedRequests = (requestsData ?? []).map((request: any) => {
      const client = Array.isArray(request.users) ? request.users[0] : request.users;
      const address = Array.isArray(request.user_addresses) ? request.user_addresses[0] : request.user_addresses;
      return {
        ...request,
        users: client || null,
        user_addresses: address || null,
      };
    });

    setAllServiceRequests(normalizedRequests as ServiceRequest[]);
  }, [supabase]);

  useEffect(() => {
    void loadServiceRequests();
  }, [loadServiceRequests]);

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

  const statusItems: StatusItem[] = notifications.map((notification: NotificationItem) => ({
    id: notification.id,
    title: notification.title,
    description: notification.message,
    timestamp: formatDate(notification.createdAt),
    type: notification.type,
    link: notification.actionLink ?? undefined,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  }));

  const generalNotifs = statusItems.filter((notification) => notification.type === "notification");
  const orderNotifs = statusItems.filter((notification) => notification.type === "order");
  const commissionNotifs = statusItems.filter(
    (notification) =>
      notification.type === "commission" ||
      notification.type === "alteration" ||
      notification.type === "repair"
  );
  const appointmentNotifs = statusItems.filter((notification) => notification.type === "appointment");

  const getRequestIdFromLink = useCallback((link?: string) => {
    if (!link) return null;
    try {
      const parsed = new URL(link, window.location.origin);
      return parsed.searchParams.get("requestId");
    } catch {
      return null;
    }
  }, []);

  const handleStatusUpdate = useCallback((id: string, newStatus: string) => {
    setAllServiceRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: newStatus as ServiceRequest["status"] } : request
      )
    );
  }, []);

  const handleOpen = useCallback(
    (item: StatusItem) => {
      if (!item.isRead) {
        void markAsRead(item.id).catch((error) => {
          console.error("Failed to mark notification as read:", error);
        });
      }

      if (item.type === "commission" || item.type === "alteration" || item.type === "repair") {
        const requestId = getRequestIdFromLink(item.link);
        const fromId = requestId
          ? allServiceRequests.find((request) => request.id === requestId)
          : null;
        const fallback = allServiceRequests.find((request) => request.service_type === item.type);
        const requestToOpen = fromId || fallback || null;

        if (requestToOpen) {
          setSelectedRequest(requestToOpen);
          setIsRequestModalOpen(true);
          return;
        }
      }

      if (item.link) {
        router.push(item.link);
      }
    },
    [allServiceRequests, getRequestIdFromLink, markAsRead, router]
  );

  return (
    <div className="p-3 sm:p-4 md:p-16 pb-28 md:pb-16 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={() =>
            void markAllAsRead().catch((error) => {
              console.error("Failed to mark all notifications as read:", error);
            })
          }
          disabled={unreadCount === 0}
          className="w-full sm:w-auto rounded-full bg-third px-4 py-2 text-white text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>
      <StatusSection title="Notifications" items={generalNotifs} loading={loading} onOpen={handleOpen} />
      <StatusSection title="Orders" items={orderNotifs} loading={loading} onOpen={handleOpen} />
      <StatusSection title="Commissions" items={commissionNotifs} loading={loading} onOpen={handleOpen} />
      <StatusSection title="Appointments" items={appointmentNotifs} loading={loading} onOpen={handleOpen} />

      <ServiceRequestDetailsModal
        isOpen={isRequestModalOpen}
        request={selectedRequest}
        onClose={() => setIsRequestModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
