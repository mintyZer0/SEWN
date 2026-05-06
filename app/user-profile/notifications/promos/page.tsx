"use client";

import React from "react";
import PromotionCard from "@/components/user-profile/promotion-card";
import ProfileSection from "@/components/user-profile/profile-section";
import { useNotifications } from "@/hooks/use-notifications";
import { getS3PublicUrl } from "@/lib/s3-client";

export default function PromotionsPage() {
  const { notifications, loading, markAllAsRead } = useNotifications();
  const promos = notifications.filter(
    (notification) => notification.type === "promotion" || notification.type === "notification"
  );

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
    <ProfileSection title="Promotions">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() =>
            void markAllAsRead(["notification", "promotion"]).catch((error) => {
              console.error("Failed to mark promotions as read:", error);
            })
          }
          className="rounded-full bg-third px-4 py-2 text-xs md:text-sm text-white font-bold transition-all active:scale-95"
        >
          Mark promotions as read
        </button>
      </div>
      <div className="space-y-6">
        {promos.length > 0 ? (
          promos.map((promo) => (
            <PromotionCard
              key={promo.id}
              title={promo.title}
              description={promo.message || "New update available."}
              date={formatDate(promo.createdAt)}
              imageSrc={getS3PublicUrl("default.jpg")}
            />
          ))
        ) : (
          <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
            <h2 className="text-third text-2xl font-bold tracking-tight mb-4">No Promotions Found</h2>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-2xl text-gray-800 font-medium text-center">
                New deals and special offers will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </ProfileSection>
  );
}
