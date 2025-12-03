"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Map() {
  const position: [number, number] = [15.4753, 120.596]; // Tarlac City, Tarlac

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
    <div className="h-200 w-max-dvw mx-10">
      <MapComponent position={position} />
    </div>
  );
}
