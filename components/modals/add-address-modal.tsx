"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

import dynamic from "next/dynamic";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback } from "react";

// Dynamically import map components to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/ui/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gray-200 animate-pulse rounded-xl" />
  ),
});

const MapSearchBox = dynamic(() => import("@/components/ui/map-search-box"), {
  ssr: false,
});

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: any) => void;
  initialData?: any;
}

export default function AddAddressModal({ isOpen, onClose, onSave, initialData }: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    barangay: "",
    city: "",
    province: "",
    postalCode: "",
    latitude: 14.5995,
    longitude: 120.9842,
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.contact_name || "",
        phone: initialData.contact_phone || "",
        addressLine: initialData.full_address || "",
        barangay: initialData.barangay || "",
        city: initialData.city || "",
        province: initialData.province || "",
        postalCode: initialData.zip_code?.toString() || "",
        latitude: initialData.latitude || 14.5995,
        longitude: initialData.longitude || 120.9842,
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        addressLine: "",
        barangay: "",
        city: "",
        province: "",
        postalCode: "",
        latitude: 14.5995,
        longitude: 120.9842,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePlaceSelected = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.geometry?.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setFormData((prev) => ({
          ...prev,
          latitude: newPos.lat,
          longitude: newPos.lng,
          addressLine: place.formatted_address || prev.addressLine,
        }));
      }
    },
    [],
  );

  const handlePositionChange = useCallback((newPos: { lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: newPos.lat,
      longitude: newPos.lng,
    }));
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-orchid p-6 flex justify-between items-center text-white shrink-0">
          <h2 className="text-3xl font-bold">{initialData ? "Edit Address" : "New Address"}</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity cursor-pointer">
            <ArrowLeft className="w-8 h-8" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Full Name</label>
              <input
                required
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Phone Number</label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+63 9XX XXX XXXX"
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Address Line</label>
              <input
                required
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                placeholder="House No., Street Name"
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Barangay</label>
              <input
                required
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                placeholder="Barangay 1"
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">City</label>
              <input
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Province</label>
              <input
                required
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Postal Code</label>
              <input
                required
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all bg-gray-50/30"
              />
            </div>
          </div>

          {/* Map Pinning Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="text-xl font-bold text-gray-700 block">Pin Exact Location</label>
            <div className="space-y-4">
              <MapSearchBox 
                onPlaceSelected={handlePlaceSelected} 
                placeholder="Search for your exact address..."
              />
              <MapComponent
                position={{ lat: formData.latitude, lng: formData.longitude }}
                height={250}
                width="100%"
                className="shadow-inner rounded-2xl border border-gray-100"
                draggable={true}
                onPositionChange={handlePositionChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl font-bold text-lg text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-third text-white px-10 py-2.5 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
