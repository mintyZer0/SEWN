"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

const SectionHeader = ({ 
  title, 
  count, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  count: number; 
  isOpen: boolean; 
  onToggle: () => void;
}) => (
  <div className="flex items-center gap-4 mb-4">
    <button 
      onClick={onToggle}
      className="flex items-center gap-2 text-primary text-2xl font-bold hover:opacity-80 transition-opacity"
    >
      {isOpen ? <ChevronDown className="w-8 h-8" /> : <ChevronDown className="w-8 h-8 -rotate-90" />}
      {title} ({count})
    </button>
    
    <div className="flex-1 relative max-w-xl ml-4">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-12 pr-4 py-2 rounded-full border-[3px] border-[#FF975E] focus:border-[#FF975E] outline-none bg-white text-lg shadow-sm"
      />
    </div>
    
    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Filter className="w-8 h-8 text-primary" />
    </button>
  </div>
);

const ListItem = ({ 
  index, 
  name, 
  type, 
  showEdit = false 
}: { 
  index: number; 
  name: string; 
  type?: string;
  showEdit?: boolean;
}) => (
  <div className="bg-white rounded-2xl p-4 mb-3 flex items-center justify-between shadow-sm border border-gray-100">
    <div className="flex items-center gap-4 text-xl text-gray-700">
      <span className="font-medium">{index}.</span>
      <span>{name}</span>
    </div>
    
    <div className="flex items-center gap-6">
      {type && (
        <span className="text-gray-400 text-lg border-l border-gray-200 pl-6 h-8 flex items-center">
          {type}
        </span>
      )}
      <div className="flex items-center gap-4">
        {showEdit && (
          <button className="text-gray-600 hover:text-primary transition-colors">
            <Pencil className="w-6 h-6" />
          </button>
        )}
        <button className="text-gray-600 hover:text-red-500 transition-colors">
          <Trash2 className="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
);

const ViewMoreButton = () => (
  <button className="w-full py-2 bg-white/50 hover:bg-white/80 border-2 border-gray-200 rounded-full text-gray-500 text-lg transition-all mb-8 shadow-sm">
    View More
  </button>
);

export default function ProductsPage() {
  const [openSections, setOpenSections] = useState({
    products: true,
    orders: true,
    commissions: true,
    appointments: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        {/* Tools Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Tools</h2>
          <div className="flex gap-6">
            <button className="px-12 py-4 rounded-2xl third-gradient text-white text-2xl font-bold shadow-lg hover:opacity-90 transition-opacity active:scale-95">
              Add Product
            </button>
            <button className="px-12 py-4 rounded-2xl third-gradient text-white text-2xl font-bold shadow-lg hover:opacity-90 transition-opacity active:scale-95">
              Commissions
            </button>
            <button className="px-12 py-4 rounded-2xl third-gradient text-white text-2xl font-bold shadow-lg hover:opacity-90 transition-opacity active:scale-95">
              View Pendings
            </button>
          </div>
        </div>

        <p className="text-xl text-gray-500 italic mb-8">
          Click to accept order, commission, or appointment
        </p>

        {/* Active Products Section */}
        <section className="mb-8">
          <SectionHeader 
            title="Active Products" 
            count={4} 
            isOpen={openSections.products}
            onToggle={() => toggleSection('products')}
          />
          {openSections.products && (
            <div className="pl-4">
              {[1, 1, 1, 1].map((_, i) => (
                <ListItem key={i} index={1} name="(Name of Product)" showEdit />
              ))}
              <ViewMoreButton />
            </div>
          )}
        </section>

        {/* Active Orders Section */}
        <section className="mb-8">
          <SectionHeader 
            title="Active Orders" 
            count={5} 
            isOpen={openSections.orders}
            onToggle={() => toggleSection('orders')}
          />
          {openSections.orders && (
            <div className="pl-4">
              {[1, 1, 1, 1, 1].map((_, i) => (
                <ListItem key={i} index={1} name="(Name of Product)" />
              ))}
              <ViewMoreButton />
            </div>
          )}
        </section>

        {/* Commissions Section */}
        <section className="mb-8">
          <SectionHeader 
            title="Commissions" 
            count={3} 
            isOpen={openSections.commissions}
            onToggle={() => toggleSection('commissions')}
          />
          {openSections.commissions && (
            <div className="pl-4">
              <ListItem index={1} name="(Name of Product)" type="Alteration" />
              <ListItem index={1} name="(Name of Product)" type="Sew" />
              <ListItem index={1} name="(Name of Product)" type="Repair" />
              <ViewMoreButton />
            </div>
          )}
        </section>

        {/* Appointments Section */}
        <section className="mb-8">
          <SectionHeader 
            title="Appointments" 
            count={2} 
            isOpen={openSections.appointments}
            onToggle={() => toggleSection('appointments')}
          />
          {openSections.appointments && (
            <div className="pl-4">
              <ListItem index={1} name="(Name of customer)" />
              <ListItem index={1} name="(Name of customer)" />
              <ViewMoreButton />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
