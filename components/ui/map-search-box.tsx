"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

interface MapSearchBoxProps {
  onPlaceSelected: (place: any) => void;
  className?: string;
  placeholder?: string;
}

export default function MapSearchBox({
  onPlaceSelected,
  className,
  placeholder = "Search for an address...",
}: MapSearchBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const placesLibrary = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLibrary || !containerRef.current) return;

    // Use the recommended PlaceAutocompleteElement
    const autocomplete = new (placesLibrary as any).PlaceAutocompleteElement();
    
    // Append to container
    containerRef.current.appendChild(autocomplete);

    const handlePlaceSelect = async (e: any) => {
      const place = e.place;
      if (!place) return;
      
      // Request necessary fields from the new Place object
      await place.fetchFields({ fields: ['location', 'displayName', 'formattedAddress'] });
      
      // Adapt the new Place object back to the old PlaceResult structure 
      // so we don't break existing parent components
      const adaptedPlace = {
        geometry: {
          location: {
            lat: () => place.location.lat(),
            lng: () => place.location.lng(),
          }
        },
        formatted_address: place.formattedAddress || place.displayName,
      };
      
      onPlaceSelected(adaptedPlace);
    };

    autocomplete.addEventListener("gmp-placeselect", handlePlaceSelect);

    return () => {
      autocomplete.removeEventListener("gmp-placeselect", handlePlaceSelect);
      if (containerRef.current && containerRef.current.contains(autocomplete)) {
        containerRef.current.removeChild(autocomplete);
      }
    };
  }, [placesLibrary, onPlaceSelected]);

  return (
    <div className={className}>
      <style>{`
        gmp-place-autocomplete {
          width: 100%;
        }
        gmp-place-autocomplete::part(input) {
          width: 100%;
          padding: 1rem;
          border-radius: 1rem;
          border: none;
          background-color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          font-size: 1.125rem;
          outline: none;
        }
        gmp-place-autocomplete::part(input):focus {
          outline: 2px solid var(--third, #f97316);
        }
      `}</style>
      <div ref={containerRef} className="w-full"></div>
    </div>
  );
}
