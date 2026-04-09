"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { createClient } from "@/utils/supabase/client";

interface CommissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionsModal = ({ isOpen, onClose }: CommissionsModalProps) => {
  const [services, setServices] = useState({
    commissions: false,
    alterations: false,
    repairs: false,
    appointments: false,
  });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isOpen) return;

    const fetchSettings = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("sewer_settings")
        .select("accepting_commissions, accepting_alterations, accepting_repairs, accepting_appointments")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setServices({
          commissions: data.accepting_commissions || false,
          alterations: data.accepting_alterations || false,
          repairs: data.accepting_repairs || false,
          appointments: data.accepting_appointments || false,
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, [isOpen]);

  const handleToggle = async (key: keyof typeof services) => {
    const newValue = !services[key];
    setServices((prev) => ({ ...prev, [key]: newValue }));
    setSavingId(key);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const dbKey = `accepting_${key}`;
      await supabase
        .from("sewer_settings")
        .upsert({ user_id: user.id, [dbKey]: newValue }, { onConflict: "user_id" });
    }
    
    setSavingId(null);
  };

  if (!isOpen) return null;

  const serviceConfig = [
    { id: "commissions" as const, label: "Accepting Commissions" },
    { id: "alterations" as const, label: "Accepting Alterations" },
    { id: "repairs" as const, label: "Accepting Repairs" },
    { id: "appointments" as const, label: "Accepting Appointments" },
  ];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[40px] p-12 max-w-2xl w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[80px] font-bold text-third leading-tight">
              Commissions
            </h2>
            <p className="text-2xl text-third mt-1">Enable services</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-12 h-12 text-third" strokeWidth={2.5} />
          </button>
        </div>

        {/* Checkbox List */}
        <div className="mt-8 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-10 h-10 animate-spin text-third" />
            </div>
          ) : (
            serviceConfig.map((service) => (
              <div key={service.id} className="flex items-center gap-4">
                <CustomCheckbox
                  label={service.label}
                  size="lg"
                  checked={services[service.id]}
                  onChange={() => handleToggle(service.id)}
                  disabled={savingId !== null}
                  labelClassName="text-3xl text-third"
                  containerClassName="gap-6"
                />
                {savingId === service.id && (
                  <Loader2 className="w-6 h-6 animate-spin text-third ml-auto" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
