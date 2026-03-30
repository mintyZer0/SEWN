"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import AddAddressModal from "@/components/modals/add-address-modal";
import ProfileSection from "@/components/user-profile/profile-section";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { AddressCard } from "@/components/user-profile/address-card";

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

export default function MyAddressesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSaveAddress = async (formData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to save an address.");
        return;
      }

      const zip = parseInt(formData.postalCode);
      if (isNaN(zip)) {
        alert("Please enter a valid numeric postal code.");
        return;
      }

      const addressData = {
        user_id: user.id,
        full_address: formData.addressLine,
        barangay: formData.barangay,
        city: formData.city,
        province: formData.province,
        zip_code: zip,
        contact_name: formData.fullName,
        contact_phone: formData.phone,
        is_primary: editingAddress ? editingAddress.is_primary : addresses.length === 0,
      };

      if (editingAddress) {
        const { error } = await supabase
          .from("user_addresses")
          .update(addressData)
          .eq("id", editingAddress.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert(addressData);
        if (error) throw error;
      }

      await fetchAddresses();
      setIsModalOpen(false);
      setEditingAddress(null);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("user_addresses").update({ is_primary: false }).eq("user_id", user.id);
      await supabase.from("user_addresses").update({ is_primary: true }).eq("id", id);
      await fetchAddresses();
    } catch (error) {
      console.error("Error setting primary:", error);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const addressToDelete = addresses.find((a) => a.id === id);
      if (!addressToDelete) return;

      const { error } = await supabase.from("user_addresses").delete().eq("id", id);
      if (error) throw error;

      if (addressToDelete.is_primary && addresses.length > 1) {
        const next = addresses.find((a) => a.id !== id);
        if (next) {
          await supabase.from("user_addresses").update({ is_primary: true }).eq("id", next.id);
        }
      }
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <ProfileSection 
      title="My Addresses" 
      description="Manage your addresses"
      headerAction={
        <ProfileButton 
          variant="white"
          onClick={openAddModal}
        >
          Add Address
        </ProfileButton>
      }
    >
      <div className="space-y-6">
        {addresses.length > 0 ? (
          addresses.map((addr, index) => (
            <AddressCard 
              key={addr.id}
              address={addr}
              index={index}
              onEdit={openEditModal}
              onSetPrimary={handleSetPrimary}
              onDelete={handleDeleteAddress}
            />
          ))
        ) : (
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-white/20">
            <h2 className="text-third text-2xl font-bold tracking-tight mb-4">No Addresses Found</h2>
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-2xl text-gray-800 font-medium text-center">
                Click "Add Address" to register a new location
              </p>
            </div>
          </div>
        )}
      </div>

      <AddAddressModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }} 
        onSave={handleSaveAddress} 
        initialData={editingAddress}
      />
    </ProfileSection>
  );
}
