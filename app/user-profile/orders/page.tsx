"use client";

import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import ProfileSection from "@/components/user-profile/profile-section";
import OrderCard, { OrderItem } from "@/components/user-profile/order-card";

const TABS = [
  "All",
  "To Pay",
  "To Ship",
  "To Receive",
  "Cancelled",
  "Completed",
];

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "1",
    sewerName: "Ysabel Santiago",
    productName: "Mint Muse",
    variant: "Premade Small 1x",
    status: "To receive",
    statusMessage: "Parcel has arrived at sorting facility",
    totalPrice: 5000,
    imageSrc: "/assets/shop-grid-products/shop-grid-product8.png",
  },
  {
    id: "2",
    sewerName: "Chini De Bertha",
    productName: "Charcoal Night",
    variant: "Measurement Profile #1",
    status: "Completed",
    statusMessage: "Parcel has been delivered",
    totalPrice: 13553,
    imageSrc: "/assets/shop-grid-products/shop-grid-product7.png",
    canConfirmReceipt: true,
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const orders = MOCK_ORDERS;

  return (
    <div className="flex flex-col max-w-[75svw] mx-auto space-y-10">
      <div className="flex flex-wrap justify-between bg-orchid gap-2 pr-10 p-4 rounded-4xl w-full">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold text-2xl transition-all ${
              activeTab === tab
                ? "bg-white text-third shadow-sm"
                : "text-white hover:bg-white/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ProfileSection className="w-full" title="" description="">
        <div className="w-full min-h-[400px] flex items-center justify-center">
          {orders.length > 0 ? (
            <div className="space-y-8 w-full">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 mx-auto text-white/20 mb-4" />
              <p className="text-3xl font-bold text-white/40">
                No orders found
              </p>
            </div>
          )}
        </div>
      </ProfileSection>
    </div>
  );
}
