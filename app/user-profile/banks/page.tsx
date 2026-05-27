"use client";

import React from "react";
import { Plus } from "lucide-react";
import ProfileSection from "@/components/user-profile/profile-section";

export default function BanksAndCardsPage() {
  return (
    <ProfileSection 
      title="Banks and Cards" 
      description="Manage your ways of payment"
    >
      <div className="bg-white rounded-[30px] p-6 sm:p-8 md:p-10 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-third text-xl sm:text-2xl font-bold tracking-tight">Credit / Debit Card</h2>
          <button className="bg-third text-white px-6 sm:px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Add Card
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-gray-800">
          <p className="text-lg sm:text-2xl font-medium">No cards have been added yet</p>
        </div>
      </div>

      <div className="bg-white rounded-[30px] p-6 sm:p-8 md:p-10 shadow-lg border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-third text-xl sm:text-2xl font-bold tracking-tight">Bank Accounts</h2>
          <button className="bg-third text-white px-6 sm:px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Add Banks
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-gray-800">
          <p className="text-lg sm:text-2xl font-medium">No banks have been added yet</p>
        </div>
      </div>
    </ProfileSection>
  );
}
