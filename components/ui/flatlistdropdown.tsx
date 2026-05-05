"use client";

import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { RotateCwSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getS3PublicUrl } from "@/lib/s3-client";

interface Product {
  id: string;
  name: string;
  price: number;
  img_src: string;
  rating?: number;
}

interface Props{
  data: Product[];
  onSelect?: () => void;
}

export default function FlatListDropdown({ data, onSelect }: Props) {
  const router = useRouter();

  if(!data || data.length === 0) {
    return(
      <div className = "bg-white shadow rounded mt-1">
        <p className="p-4 text-gray-500 text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded mt-1 max-h-80 overflow-y-auto border">
      {data.map((item) => (
        <div 
          key={item.id} 
          onClick={() => {
            router.push(`/checkout?id=${item.id}`);
            onSelect?.();
          }}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
        >

          {/*Img*/}
          <img
            src = {getS3PublicUrl(item.img_src)}
            alt = {item.name}
            className="w-12 h-12 object-cover rounded"
          />

          {/*Deets*/}
          <div className="flex flex-col">
            <p className="font-medium text-sm truncate">{item.name}</p>
            <p className="text-xs text-gray-500">₱{item.price}</p>
          </div>

          {/*Rating*/}
          <div className = "text-xs text-yellow-500 whitespace-nowrap">
            ⭐ {item.rating ?? 0}
          </div>
        </div>
      ))}
    </div>
  )
}