"use client";

import React, { useState } from "react";
import { X, Calendar, Mail, User, Phone, CheckCircle, XCircle, Loader2, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn, getChatRoomId } from "@/lib/utils";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

export interface ServiceRequest {
  id: string;
  client_id: string;
  address_id: string;
  service_type: string;
  subject: string;
  request_details: string;
  appointment_date: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  measurement_profile_id?: string | null;
  users?: {
    first_name: string;
    last_name: string;
    email?: string;
  } | null;
  user_addresses?: {
    full_address: string;
    barangay: string;
    city: string;
    province: string;
    zip_code: number;
    contact_name?: string | null;
    contact_phone?: string | null;
  };
}

interface ServiceRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export const ServiceRequestDetailsModal = ({
  isOpen,
  onClose,
  request,
  onStatusUpdate,
}: ServiceRequestDetailsModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  if (!isOpen || !request) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("service_requests")
        .update({ status: newStatus })
        .eq("id", request.id);

      if (error) throw error;

      // If accepted, automatically ensure a chat exists
      if (newStatus === "accepted") {
        await ensureChatExists();
      }

      onStatusUpdate(request.id, newStatus);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const ensureChatExists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use the stable room ID function from lib/utils
      // This creates a deterministic ID like "uuid1_uuid2"
      const stableConversationId = getChatRoomId(user.id, request.client_id);

      // 1. Check if this specific room ID already exists
      const { data: existing, error: selectErr } = await supabase
        .from("chat_conversations")
        .select("id")
        .eq("id", stableConversationId)
        .maybeSingle();

      if (existing) return existing.id;

      // 2. Create it if it doesn't (using the stable string as the 'id')
      const { data: newConv, error: insertErr } = await supabase
        .from("chat_conversations")
        .insert({
          id: stableConversationId,
          buyer_id: request.client_id,
          sewist_id: user.id,
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error("Failed to create stable chat room. Ensure DB 'id' is TEXT type:", insertErr);
        throw insertErr;
      }
      return newConv.id;
    } catch (err) {
      console.error("Error ensuring chat exists:", err);
    }
  };

  const handleOpenChat = async () => {
    const conversationId = await ensureChatExists();
    if (conversationId) {
      // Redirect to chat with this conversation selected
      window.location.href = `/sewist-app/chat?conversationId=${conversationId}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clientName = request.users
    ? `${request.users.first_name || ""} ${request.users.last_name || ""}`.trim()
    : request.user_addresses?.contact_name || "Customer";
  const clientEmail = request.users?.email || "No email found";
  const clientPhone = request.user_addresses?.contact_phone || "Not provided";
  const clientAddress = request.user_addresses
    ? `${request.user_addresses.full_address}, ${request.user_addresses.barangay}, ${request.user_addresses.city}, ${request.user_addresses.province} ${request.user_addresses.zip_code}`
    : "No address found";

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl md:rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[92vh]">
        {/* Header */}
        <div className="bg-third p-4 sm:p-6 md:p-8 text-white flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider mb-2 inline-block">
              {request.service_type} Request
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words">{request.subject}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5 md:space-y-8 max-h-[58vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-5 h-5 text-third" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase">Client</p>
                  <p className="font-semibold text-base md:text-lg break-words">{clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-third" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                  <p className="font-semibold text-sm md:text-base break-words">{clientEmail}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-third" />
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Requested Date</p>
                  <p className="font-semibold text-sm md:text-base">{formatDate(request.appointment_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-third" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                  <p className="font-semibold text-sm md:text-base break-words">{clientPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 md:pt-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Address</h3>
            <div className="bg-gray-50 rounded-2xl p-3 md:p-4 text-gray-700 leading-relaxed text-sm md:text-base break-words">
              {clientAddress}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 md:pt-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Request Details</h3>
            <div className="bg-gray-50 rounded-2xl p-4 md:p-6 text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-lg italic break-words">
              "{request.request_details}"
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-gray-100">
          {request.status === "pending" ? (
            <>
              <ProfileButton
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("accepted")}
                variant="green"
                size="lg"
                className="w-full sm:flex-1 gap-2"
              >
                {isUpdating ? <Loader2 className="animate-spin" /> : <CheckCircle />}
                Accept Request
              </ProfileButton>
              <ProfileButton
                disabled={isUpdating}
                onClick={() => handleUpdateStatus("cancelled")}
                variant="orange"
                size="lg"
                className="w-full sm:flex-1 gap-2"
              >
                <XCircle />
                Decline
              </ProfileButton>
            </>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "px-3 md:px-4 py-2 rounded-full font-bold uppercase tracking-tighter text-xs md:text-sm",
                  request.status === "accepted" ? "bg-green-100 text-green-600" : 
                  request.status === "completed" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                )}>
                  Status: {request.status}
                </span>
              </div>
              <ProfileButton 
                onClick={handleOpenChat}
                variant="orange"
                size="md"
                className="w-full sm:w-auto gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Open Chat
              </ProfileButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
