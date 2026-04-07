"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationData {
  regCode?: string;
  regDesc?: string;
  provCode?: string;
  provDesc?: string;
  citymunCode?: string;
  citymunDesc?: string;
  brgyCode?: string;
  brgyDesc?: string;
}

interface LocationPickerProps {
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  required?: boolean;
}

export const LocationPicker = ({
  name,
  defaultValue = "",
  onChange,
  className,
  triggerClassName,
  placeholder = "Select Location",
  required
}: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Region" | "Province" | "City" | "Barangay">("Region");
  
  const [regions, setRegions] = useState<LocationData[]>([]);
  const [provinces, setProvinces] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<LocationData[]>([]);
  const [barangays, setBarangays] = useState<LocationData[]>([]);
  
  const [selectedRegion, setSelectedRegion] = useState<LocationData | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<LocationData | null>(null);
  const [selectedCity, setSelectedCity] = useState<LocationData | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<LocationData | null>(null);

  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial load of regions
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await fetch(`/data/locations/regions.json?v=${Date.now()}`);
        const data = await res.json();
        setRegions(data.RECORDS);
      } catch (err) {
        console.error("Failed to load regions", err);
      }
    };
    loadRegions();
  }, []);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRegion = async (reg: LocationData) => {
    setSelectedRegion(reg);
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedBarangay(null);
    setActiveTab("Province");
    setLoading(true);
    try {
      const res = await fetch(`/data/locations/provinces.json?v=${Date.now()}`);
      const data = await res.json();
      const filtered = data.RECORDS.filter((p: any) => p.regCode === reg.regCode);
      setProvinces(filtered);
    } catch (err) {
      console.error("Failed to load provinces", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvince = async (prov: LocationData) => {
    setSelectedProvince(prov);
    setSelectedCity(null);
    setSelectedBarangay(null);
    setActiveTab("City");
    setLoading(true);
    try {
      const res = await fetch(`/data/locations/cities.json?v=${Date.now()}`);
      const data = await res.json();
      const filtered = data.RECORDS.filter((c: any) => c.provCode === prov.provCode);
      setCities(filtered);
    } catch (err) {
      console.error("Failed to load cities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (city: LocationData) => {
    setSelectedCity(city);
    setSelectedBarangay(null);
    setActiveTab("Barangay");
    setLoading(true);
    try {
      const res = await fetch(`/data/locations/barangays.json?v=${Date.now()}`);
      const data = await res.json();
      const filtered = data.RECORDS.filter((b: any) => b.citymunCode === city.citymunCode);
      setBarangays(filtered);
    } catch (err) {
      console.error("Failed to load barangays", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBarangay = (brgy: LocationData) => {
    setSelectedBarangay(brgy);
    const fullLocation = `${selectedRegion?.regDesc} / ${selectedProvince?.provDesc} / ${selectedCity?.citymunDesc} / ${brgy.brgyDesc}`;
    if (onChange) onChange(fullLocation);
    setIsOpen(false);
  };

  const displayValue = selectedBarangay 
    ? `${selectedRegion?.regDesc} / ${selectedProvince?.provDesc} / ${selectedCity?.citymunDesc} / ${selectedBarangay?.brgyDesc}`
    : selectedCity
    ? `${selectedRegion?.regDesc} / ${selectedProvince?.provDesc} / ${selectedCity?.citymunDesc}`
    : selectedProvince
    ? `${selectedRegion?.regDesc} / ${selectedProvince?.provDesc}`
    : selectedRegion
    ? selectedRegion?.regDesc
    : "";

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <input type="hidden" name={name} value={displayValue || ""} required={required} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 rounded-xl border border-third/20 bg-white px-4 flex items-center justify-between cursor-pointer transition-all",
          isOpen ? "border-third ring-2 ring-third/10" : "hover:border-third/40",
          triggerClassName
        )}
      >
        <span className={cn("text-gray-700 truncate", !displayValue && "text-gray-400")}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={cn("text-gray-400 w-5 h-5 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full md:w-[600px] bg-white border border-gray-200 shadow-2xl rounded-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50">
            {["Region", "Province", "City", "Barangay"].map((tab) => {
              const isAvailable = 
                tab === "Region" || 
                (tab === "Province" && selectedRegion) ||
                (tab === "City" && selectedProvince) ||
                (tab === "Barangay" && selectedCity);

              return (
                <button
                  key={tab}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "flex-1 py-2 px-1 text-sm font-medium rounded-lg transition-colors",
                    activeTab === tab 
                      ? "bg-third/10 text-third" 
                      : isAvailable 
                      ? "text-gray-600 hover:bg-gray-100" 
                      : "text-gray-300 cursor-not-allowed"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Options Grid */}
          <div className="p-4 max-h-[300px] overflow-y-auto min-h-[200px] relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-third animate-spin" />
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeTab === "Region" && regions.map((item) => (
                <button
                  key={item.regCode}
                  type="button"
                  onClick={() => handleSelectRegion(item)}
                  className={cn(
                    "text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-third/5 hover:text-third",
                    selectedRegion?.regCode === item.regCode ? "bg-third text-white hover:bg-third hover:text-white" : "text-gray-600"
                  )}
                >
                  {item.regDesc}
                </button>
              ))}

              {activeTab === "Province" && provinces.map((item) => (
                <button
                  key={item.provCode}
                  type="button"
                  onClick={() => handleSelectProvince(item)}
                  className={cn(
                    "text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-third/5 hover:text-third",
                    selectedProvince?.provCode === item.provCode ? "bg-third text-white hover:bg-third hover:text-white" : "text-gray-600"
                  )}
                >
                  {item.provDesc}
                </button>
              ))}

              {activeTab === "City" && cities.map((item) => (
                <button
                  key={item.citymunCode}
                  type="button"
                  onClick={() => handleSelectCity(item)}
                  className={cn(
                    "text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-third/5 hover:text-third",
                    selectedCity?.citymunCode === item.citymunCode ? "bg-third text-white hover:bg-third hover:text-white" : "text-gray-600"
                  )}
                >
                  {item.citymunDesc}
                </button>
              ))}

              {activeTab === "Barangay" && barangays.map((item) => (
                <button
                  key={item.brgyCode}
                  type="button"
                  onClick={() => handleSelectBarangay(item)}
                  className={cn(
                    "text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-third/5 hover:text-third",
                    selectedBarangay?.brgyCode === item.brgyCode ? "bg-third text-white hover:bg-third hover:text-white" : "text-gray-600"
                  )}
                >
                  {item.brgyDesc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
