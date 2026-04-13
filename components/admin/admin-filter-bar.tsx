"use client";

import React from "react";
import { Search, ChevronDown, Calendar, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminFilterBarProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onDateChange?: (value: string) => void;
}

export function AdminFilterBar({
  onSearchChange,
  onStatusChange,
  onDateChange,
}: AdminFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Left: Search Input */}
      <div className="relative w-full max-w-[320px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={18} />
        <div className="bg-primary/80 rounded-full pl-10 pr-2 py-1.5 flex items-center shadow-sm">
          <input
            type="text"
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full h-8 rounded-full bg-white px-4 outline-none text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Right: Dropdowns and Filter */}
      <div className="flex items-center gap-3">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onStatusChange?.(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2 bg-primary/80 text-white rounded-xl focus:outline-none transition-all text-sm font-medium cursor-pointer shadow-sm"
          >
            <option value="all">Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" size={16} />
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => onDateChange?.(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2 bg-primary/80 text-white rounded-xl focus:outline-none transition-all text-sm font-medium cursor-pointer shadow-sm"
          >
            <option value="jan-feb">Jan 01, 2026 - February 01</option>
          </select>
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" size={16} />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" size={16} />
        </div>

        {/* Filter Button */}
        <button className="p-2.5 bg-primary/80 text-white rounded-xl shadow-sm hover:opacity-90 transition-opacity">
          <Filter size={18} />
        </button>
      </div>
    </div>
  );
}

export function PageHeader({ 
  title, 
  stats 
}: { 
  title: string; 
  stats: { label: string; count: number | string }[] 
}) {
  return (
    <div className="flex flex-col gap-10 mb-8">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight">{title}</h1>
      </div>
      
      <div className="flex justify-between items-center px-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-lg font-bold text-primary/70">{stat.label}</span>
            <span className="text-2xl font-medium text-gray-400">{stat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
