"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import PromotionCard from "@/components/user-profile/promotion-card";
import ProfileSection from "@/components/user-profile/profile-section";

export default function PromotionsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [promos, setPromos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPromos() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPromos();
  }, [supabase]);

  if (loading) return <div className="flex h-[400px] items-center justify-center">Loading...</div>;

  return (
    <ProfileSection title="Promotions">
      <div className="space-y-6">
        {promos.length > 0 ? (
          promos.map((promo) => (
            <PromotionCard
              key={promo.id}
              title={promo.title}
              description={promo.description}
              priceInfo={promo.price_info}
              date={promo.created_at}
              imageSrc={promo.image_url}
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
