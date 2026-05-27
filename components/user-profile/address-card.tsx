"use client";

import React from "react";
import { ProfileButton } from "./profile-buttons";

interface Address {
  id: string;
  user_id: string;
  full_address: string;
  barangay: string;
  city: string;
  province: string;
  zip_code: number;
  is_primary: boolean;
  contact_name?: string;
  contact_phone?: string;
}

interface AddressCardProps {
  address: Address;
  index: number;
  onEdit: (address: Address) => void;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AddressCard = ({ 
  address, 
  index, 
  onEdit, 
  onSetPrimary, 
  onDelete 
}: AddressCardProps) => {
  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start shadow-lg border ${address.is_primary ? 'border-third' : 'border-white/20'}`}>
      <div className="space-y-4">
        <h2 className="text-third text-xl sm:text-2xl font-bold tracking-tight">
          Address #{index + 1} {address.is_primary && "(Primary)"}
        </h2>
        <div className="text-gray-500 text-base sm:text-lg space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg md:text-xl">
            <span className="text-base sm:text-lg md:text-xl text-black">{address.contact_name}</span>
            <span className="text-gray-400 font-normal">|</span>
            <span>{address.contact_phone}</span>
          </div>
          <p className="">{address.full_address}</p>
          <p className="">{address.barangay}, {address.city}</p>
          <p className="">{address.province} {address.zip_code}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:min-w-36">
        <ProfileButton 
          variant="orange" 
          size="md" 
          className="w-full sm:w-auto md:w-full"
          onClick={() => onEdit(address)}
        >
          Edit
        </ProfileButton>
        {!address.is_primary && (
          <ProfileButton 
            variant="orange" 
            size="md" 
            className="w-full sm:w-auto md:w-full"
            onClick={() => onSetPrimary(address.id)}
          >
            Set Primary
          </ProfileButton>
        )}
        <ProfileButton 
          variant="orange" 
          size="md" 
          className="w-full sm:w-auto md:w-full"
          onClick={() => onDelete(address.id)}
        >
          Delete
        </ProfileButton>
      </div>
    </div>
  );
};
