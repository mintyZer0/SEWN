"use client";

import React from "react";
import OrderUpdateCard from "@/components/user-profile/order-update-card";
import ProfileSection from "@/components/user-profile/profile-section";
import { useNotifications } from "@/hooks/use-notifications";
import { getS3PublicUrl } from "@/lib/s3-client";

export default function OrderUpdatesPage() {
  const { notifications, loading, markAllAsRead } = useNotifications();
  const updates = notifications.filter((notification) => notification.type === "order");

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  if (loading) return <div className="flex h-[400px] items-center justify-center">Loading...</div>;

  return (
    <ProfileSection title="Order Updates">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() =>
            void markAllAsRead(["order"]).catch((error) => {
              console.error("Failed to mark order updates as read:", error);
            })
          }
          className="rounded-full bg-third px-4 py-2 text-xs md:text-sm text-white font-bold transition-all active:scale-95"
        >
          Mark orders as read
        </button>
      </div>
      <div className="space-y-6">
        {updates.length > 0 ? (
          updates.map((update) => (
            <OrderUpdateCard
              key={update.id}
              productName={update.title}
              statusMessage={update.message || "Order status changed."}
              date={formatDate(update.createdAt)}
              imageSrc={getS3PublicUrl("default.jpg")}
            />
          ))
        ) : (
          <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
            <h2 className="text-third text-2xl font-bold tracking-tight mb-4">No Updates Found</h2>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-2xl text-gray-800 font-medium text-center">
                Your order notifications will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  );
}
