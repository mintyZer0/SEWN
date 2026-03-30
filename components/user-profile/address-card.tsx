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
    <div className={`bg-white rounded-3xl p-10 flex justify-between items-start shadow-lg border ${address.is_primary ? 'border-third' : 'border-white/20'}`}>
      <div className="space-y-4">
        <h2 className="text-third text-2xl font-bold tracking-tight">
          Address #{index + 1} {address.is_primary && "(Primary)"}
        </h2>
        <div className="text-gray-500 text-lg space-y-1">
          <div className="flex items-center gap-2 text-xl">
            <span className="text-xl text-black">{address.contact_name}</span>
            <span className="text-gray-400 font-normal">|</span>
            <span>{address.contact_phone}</span>
          </div>
          <p className="">{address.full_address}</p>
          <p className="">{address.barangay}, {address.city}</p>
          <p className="">{address.province} {address.zip_code}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 min-w-36">
        <ProfileButton 
          variant="orange" 
          size="md" 
          onClick={() => onEdit(address)}
        >
          Edit
        </ProfileButton>
        {!address.is_primary && (
          <ProfileButton 
            variant="orange" 
            size="md" 
            onClick={() => onSetPrimary(address.id)}
          >
            Set Primary
          </ProfileButton>
        )}
        <ProfileButton 
          variant="orange" 
          size="md" 
          onClick={() => onDelete(address.id)}
        >
          Delete
        </ProfileButton>
      </div>
    </div>
  );
};
