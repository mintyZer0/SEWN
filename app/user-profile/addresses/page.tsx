"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AddAddressModal from "@/components/modals/add-address-modal";

export default function MyAddressesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, [supabase]);

  const handleSaveAddress = async (addressData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log("Saving address:", addressData);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleEditAddress = async (id: string) => {};
  const handleDeleteAddress = async (id: string) => {};

  if (loading) return <div className="flex h-[400px] items-center justify-center">Loading...</div>;

  return (
    <div className="bg-orchid rounded-[40px] p-8 md:p-12 min-h-[600px] relative shadow-2xl">
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">My Addresses</h1>
          <p className="text-white/80 text-xl font-medium">Manage your addresses</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-third px-8 py-3 rounded-xl font-bold text-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
        >
          Add Address
        </button>
      </header>

      <div className="space-y-6">
        {addresses.length > 0 ? (
          addresses.map((addr, index) => (
            <div key={addr.id} className="bg-white rounded-[30px] p-10 flex justify-between items-start shadow-lg border border-white/20">
              <div className="space-y-4">
                <h2 className="text-third text-2xl font-bold tracking-tight">Address #{index + 1}</h2>
                <div className="text-gray-800 space-y-1">
                  <p className="text-xl font-bold">{addr.fullName} | {addr.phone}</p>
                  <p className="text-lg">{addr.addressLine}</p>
                  <p className="text-lg">{addr.city}, {addr.province} {addr.postalCode}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[140px]">
                <button onClick={() => handleEditAddress(addr.id)} className="bg-third text-white px-6 py-2 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition-all active:scale-95">Edit</button>
                <button onClick={() => handleDeleteAddress(addr.id)} className="bg-third text-white px-6 py-2 rounded-xl font-bold text-lg shadow-md hover:opacity-90 transition-all active:scale-95">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
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
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveAddress} 
      />
    </div>
  );
}
