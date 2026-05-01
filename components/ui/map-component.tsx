"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MapComponentProps {
  position: { lat: number; lng: number };
  height?: string | number;
  width?: string | number;
  className?: string;
  draggable?: boolean;
  onPositionChange?: (position: { lat: number; lng: number }) => void;
  zoom?: number;
}

// Inner component to use the map instance
function MapContent({
  position,
  zoom,
  mapId,
  onClick,
  draggable,
  onMarkerDragEnd,
}: {
  position: { lat: number; lng: number };
  zoom: number;
  mapId: string;
  onClick: (e: MapMouseEvent) => void;
  draggable: boolean;
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
}) {
  const map = useMap();

  // Smoothly pan the map when position changes from external sources (like Search)
  useEffect(() => {
    if (map) {
      map.panTo(position);
    }
  }, [map, position.lat, position.lng]);

  return (
    <Map
      defaultCenter={position}
      defaultZoom={zoom}
      mapId={mapId}
      onClick={onClick}
      gestureHandling={"greedy"}
      disableDefaultUI={false}
    >
      <AdvancedMarker
        position={position}
        draggable={draggable}
        onDragEnd={onMarkerDragEnd}
      >
        <Pin
          background={"#FB923C"}
          borderColor={"#ffffff"}
          glyphColor={"#ffffff"}
        />
      </AdvancedMarker>
    </Map>
  );
}

export default function MapComponent({
  position,
  height = "100%",
  width = "100%",
  className,
  draggable = false,
  onPositionChange,
  zoom = 15,
}: MapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

  const handleMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        onPositionChange?.(newPos);
      }
    },
    [onPositionChange],
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (draggable && e.detail.latLng) {
        const newPos = e.detail.latLng;
        onPositionChange?.(newPos);
      }
    },
    [draggable, onPositionChange],
  );

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ 
        height: height && !className?.includes('h-[') ? height : undefined, 
        width: width && !className?.includes('w-[') ? width : undefined 
      }}
    >
      <MapContent
        position={position}
        zoom={zoom}
        mapId={mapId}
        onClick={handleMapClick}
        draggable={draggable}
        onMarkerDragEnd={handleMarkerDragEnd}
      />
    </div>
  );
}
