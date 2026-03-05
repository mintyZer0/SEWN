"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import OrderUpdateCard from "@/components/user-profile/order-update-card";

export default function OrderUpdatesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, [supabase]);

  if (loading)
    return (
      <div className="flex h-[400px] items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="bg-orchid rounded-[40px] p-8 md:p-12 min-h-[600px] max-h-[1000px] relative shadow-2xl overflow-hidden">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-white mb-2">Order Updates</h1>
      </header>

      <div className="space-y-6 max-h-[65svh] overflow-y-scroll">
        {updates.length > 0 ? (
          updates.map((update) => (
            <OrderUpdateCard
              key={update.id}
              productName={update.product_name}
              sewerName={update.sewer_name}
              statusMessage={update.status_message}
              date={update.created_at}
              imageSrc={update.image_url}
            />
          ))
        ) : (
          <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
            <h2 className="text-third text-2xl font-bold tracking-tight mb-4">
              No Updates Found
            </h2>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-2xl text-gray-800 font-medium text-center">
                Your order notifications will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
