"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function BanksAndCardsPage() {
  return (
    <div className="bg-orchid rounded-[40px] p-8 md:p-12 min-h-[600px] relative shadow-2xl">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-white mb-2">Banks and Cards</h1>
        <p className="text-white/80 text-xl font-medium">Manage your ways of payment</p>
      </header>

      <div className="space-y-6">
        {/* Credit / Debit Card Section */}
        <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-third text-2xl font-bold tracking-tight">Credit / Debit Card</h2>
            <button className="bg-third text-white px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Card
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-gray-800">
            <p className="text-2xl font-medium">No cards have been added yet</p>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="bg-white rounded-[30px] p-10 shadow-lg border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-third text-2xl font-bold tracking-tight">Bank Accounts</h2>
            <button className="bg-third text-white px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Banks
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-gray-800">
            <p className="text-2xl font-medium">No banks have been added yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
