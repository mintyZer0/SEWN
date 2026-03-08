"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { cn } from "@/lib/utils";

interface MapComponentProps {
  position: [number, number];
  height?: string | number;
  width?: string | number;
  className?: string;
}

export default function MapComponent({ 
  position, 
  height = "100%", 
  width = "100%",
  className 
}: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div 
        style={{ height, width }}
        className={cn("bg-gray-200 animate-pulse rounded-lg flex items-center justify-center text-gray-400", className)}
      >
        Loading Map...
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ height, width }}
    >
      <MapContainer
        key={`${position[0]}-${position[1]}`}
        center={position}
        zoom={90}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
