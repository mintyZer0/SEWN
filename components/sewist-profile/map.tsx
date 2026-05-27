"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

interface SewistMapProps {
  position?: { lat: number; lng: number };
}

export default function Map({ position = { lat: 15.4753, lng: 120.596 } }: SewistMapProps) {

  const MapComponent = useMemo(
    () =>
      dynamic(() => import("../ui/map-component"), {
        loading: () => (
          <div className="h-300 w-full bg-gray-200 animate-pulse rounded-lg" />
        ),
        ssr: false,
      }),
    []
  );

  return (
    <div className="h-80 sm:h-120 md:h-200 w-full md:w-[70vw] max-w-full mx-auto">
      <MapComponent position={position} />
    </div>
  );
}
