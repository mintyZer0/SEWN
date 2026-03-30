"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

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
  });

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
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-orchid p-6 flex justify-between items-center text-white">
          <h2 className="text-3xl font-bold">{initialData ? "Edit Address" : "New Address"}</h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity cursor-pointer">
            <ArrowLeft className="w-8 h-8" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

          <div className="flex justify-end gap-4 pt-4">
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
