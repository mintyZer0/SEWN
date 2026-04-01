"use client";

import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";

interface MapSearchBoxProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  className?: string;
  placeholder?: string;
}

export default function MapSearchBox({
  onPlaceSelected,
  className,
  placeholder = "Search for an address...",
}: MapSearchBoxProps) {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    const ac = new placesLibrary.Autocomplete(inputRef.current, options);
    setAutocomplete(ac);

    return () => {
      // Cleanup if necessary
    };
  }, [placesLibrary]);

  useEffect(() => {
    if (!autocomplete) return;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });
  }, [autocomplete, onPlaceSelected]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
      />
    </div>
  );
}
