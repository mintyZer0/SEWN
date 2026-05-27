"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ChatWithSewistButton, ViewSewistButton, ConfirmDeliveryButton } from "./profile-buttons";

export interface OrderItem {
  id: string;
  sewistId: string;
  sewistName: string;
  productName: string;
  variant: string;
  status: string;
  statusMessage: string;
  totalPrice: number;
  imageSrc: string;
  canConfirmReceipt?: boolean;
}

interface OrderCardProps {
  order: OrderItem;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="bg-white rounded-[35px] p-6 md:p-8 shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-third/30">
        <div className="flex items-center gap-3">
          <div className="text-third">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-third">{order.sewistName}</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <ChatWithSewistButton className="flex-1 md:flex-none" />
          <ViewSewistButton
            sewistId={order.sewistId}
            className="flex-1 md:flex-none"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6">
        <div className="flex flex-1 gap-6">
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-[25px] overflow-hidden bg-gray-100">
            <Image
              src={order.imageSrc}
              alt={order.productName}
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-third mb-2">
              {order.productName}
            </h4>
            <p className="text-gray-600 text-base sm:text-lg">{order.variant}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center border-t border-third/30 pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-8">
          <h5 className="text-lg sm:text-xl md:text-2xl text-third font-medium mb-1">
            Order Update: <span className="font-bold">{order.status}</span>
          </h5>
          <p className="text-gray-600 text-base sm:text-lg">{order.statusMessage}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-third/10">
        <div className="w-full md:w-auto">
          {order.canConfirmReceipt ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium text-base sm:text-lg">
                Confirm Receipt:
              </span>
              <ConfirmDeliveryButton asChild>
                <Link
                  href={`/user-profile/orders/${order.id}`}
                  className="inline-block text-center"
                >
                  Confirm Delivery
                </Link>
              </ConfirmDeliveryButton>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Confirm receipt after you've checked the received items and made
              payment
            </p>
          )}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl">
          Order total: <span className="text-black">P{order.totalPrice}</span>
        </div>
      </div>
    </div>
  );
}
