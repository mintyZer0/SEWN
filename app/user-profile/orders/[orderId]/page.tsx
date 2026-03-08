"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useParams } from "next/navigation";
import {
  ChatWithSewerButton,
  ViewSewerButton,
  ConfirmDeliveryButton,
} from "@/components/user-profile/profile-buttons";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  // In a real app, you would use useEffect to fetch from Supabase
  // const [orderData, setOrderData] = useState<any>(null);
  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     const { data } = await supabase.from('orders').select('*').eq('id', orderId).single();
  //     setOrderData(data);
  //   };
  //   fetchOrder();
  // }, [orderId]);

  const orderData = {
    id: orderId || "260212G9VCMFY0",
    sewerId: "678e8400-e29b-41d4-a716-446655440000",
    sewerName: "Chini De Bertha",
    productName: "Charcoal Night",
    variant: "Measurement Profile #1",
    status: "Completed",
    statusMessage: "Parcel has been delivered",
    order_status_description: "Your order has been delivered",
    totalPrice: 13553,
    imageSrc: "/assets/shop-grid-products/shop-grid-product7.png",
    address: {
      name: "Kharl Asuncion",
      phone: "(+63) 961 163 4262",
      line1: "San Amigo, Tarlac City, Tarlac, Central Luzon, 2300",
    },
    paymentMethod: "Payed with Card",
    tracking: [
      {
        date: "02/13/2026",
        time: "09:55",
        status: "Delivered",
        status_description: "Parcel has been delivered",
        highlight: true,
      },
      {
        date: "02/13/2026",
        time: "09:55",
        status: "In transit",
        status_description: "Parcel is out for delivery.",
        highlight: true,
      },
      {
        date: "02/13/2026",
        time: "08:25",
        status: "",
        status_description: "Delivery driver has been assigned",
        highlight: false,
      },
      {
        date: "02/13/2026",
        time: "07:04",
        status: "",
        status_description:
          "Your parcel has arrived at the delivery hub : Tarlac Hub",
        highlight: false,
      },
    ],
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-8 bg-white/50 rounded-4xl">
      <div className="flex justify-end items-center gap-2 text-gray-500 text-sm mt-4">
        <span className="uppercase tracking-wider">
          ORDER ID. {orderData.id}
        </span>
        <span className="border-l border-gray-400 h-6 mx-4"></span>
        <span className="text-gray-400 italic text-lg">
          {orderData.order_status_description}
        </span>
      </div>

      <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 overflow-hidden">
        {/* Sewer Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-orange-200/50">
          <div className="flex items-center gap-3">
            <div className="text-third">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-third">
              {orderData.sewerName}
            </h3>
          </div>
          <div className="flex gap-4">
            <ChatWithSewerButton />
            <ViewSewerButton sewerId={orderData.sewerId} />
          </div>
        </div>

        {/* Product & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex gap-6 items-center">
            <div className="relative w-40 h-40 shrink-0 rounded-[30px] overflow-hidden bg-gray-50">
              <Image
                src={orderData.imageSrc}
                alt={orderData.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h4 className="text-5xl font-bold text-third mb-2 leading-tight">
                {orderData.productName.split(" ")[0]}
                <br />
                {orderData.productName.split(" ")[1]}
              </h4>
              <a
                href="#"
                className="text-blue-600 text-lg hover:underline font-medium"
              >
                {orderData.variant}
              </a>
            </div>
          </div>

          <div className="flex flex-col justify-center md:border-l md:border-orange-200/50 md:pl-12">
            <h5 className="text-2xl text-third font-medium mb-1">
              Order Update:{" "}
              <span className="font-bold">{orderData.status}</span>
            </h5>
            <p className="text-gray-600 text-xl">{orderData.statusMessage}</p>
          </div>
        </div>

        {/* Confirm Action & Total */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 pt-6 border-t border-orange-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium text-2xl">
                Confirm Receipt:
              </span>
              <ConfirmDeliveryButton>Confirm Delivery</ConfirmDeliveryButton>
            </div>
            <p className="text-gray-400 text-sm italic ml-2">
              Please check your product(s) before confirming delivery
            </p>
          </div>
          <div className="text-3xl font-medium">
            Order total:{" "}
            <span className="text-black font-bold ml-4">
              P{orderData.totalPrice}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 my-4" />

      {/* Footer Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
        {/* Left: Delivery Address */}
        <div className="space-y-4">
          <h6 className="text-2xl text-gray-500">Delivery Address</h6>
          <div className="space-y-2">
            <p className="text-2xl font-medium text-gray-800">
              {orderData.address.name} | {orderData.address.phone}
            </p>
            <p className="text-2xl text-gray-700 leading-relaxed max-w-md">
              {orderData.address.line1}
            </p>
          </div>
        </div>

        {/* Right: Payment & Tracking */}
        <div className="space-y-4">
          <h6 className="text-2xl text-gray-500">{orderData.paymentMethod}</h6>

          {/* Tracking History */}
          <div className="space-y-8 mt-4">
            {orderData.tracking.map((item, index) => (
              <div key={index} className="flex gap-8">
                <div className="flex flex-col text-gray-500 text-xl shrink-0">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  {item.status && (
                    <span
                      className={`text-xl font-bold ${item.highlight ? "text-primary" : "text-gray-800"}`}
                    >
                      {item.status}
                    </span>
                  )}
                  <span
                    className={`text-xl ${item.highlight ? "text-gray-800 font-medium" : "text-gray-600"}`}
                  >
                    {item.status_description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
