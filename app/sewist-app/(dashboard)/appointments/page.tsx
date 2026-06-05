"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import PrimaryButton from "@/components/ui/primary-button";
import { Loader2, Calendar, Clock, Users, Save } from "lucide-react";
import { motion } from "framer-motion";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const APPOINTMENTS_CACHE_VERSION = 1;
const APPOINTMENTS_LAST_CACHE_KEY = "sewist-appointments-last-cache";

type AppointmentsCachePayload = {
  version: number;
  cachedAt: number;
  data: {
    userId: string;
    hours: Record<number, any>;
  };
};

export default function AppointmentsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const [hours, setHours] = useState<Record<number, any>>({});
  const [userId, setUserId] = useState<string>("");
  const [hasHydratedInitialCache, setHasHydratedInitialCache] = useState(false);
  const [activeDay, setActiveDay] = useState<number>(1); // Default to Monday

  const readAppointmentsCache = (nextUserId: string): AppointmentsCachePayload | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(`sewist-appointments-cache:${nextUserId}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AppointmentsCachePayload;
      if (parsed.version !== APPOINTMENTS_CACHE_VERSION) return null;
      return parsed;
    } catch (error) {
      console.error("Failed to parse appointments cache:", error);
      return null;
    }
  };

  const readLatestAppointmentsCache = (): AppointmentsCachePayload | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(APPOINTMENTS_LAST_CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AppointmentsCachePayload;
      if (parsed.version !== APPOINTMENTS_CACHE_VERSION) return null;
      return parsed;
    } catch (error) {
      console.error("Failed to parse latest appointments cache:", error);
      return null;
    }
  };

  const writeAppointmentsCache = (nextUserId: string, nextHours: Record<number, any>) => {
    if (typeof window === "undefined") return;
    const payload: AppointmentsCachePayload = {
      version: APPOINTMENTS_CACHE_VERSION,
      cachedAt: Date.now(),
      data: {
        userId: nextUserId,
        hours: nextHours,
      },
    };
    window.localStorage.setItem(`sewist-appointments-cache:${nextUserId}`, JSON.stringify(payload));
    window.localStorage.setItem(APPOINTMENTS_LAST_CACHE_KEY, JSON.stringify(payload));
  };

  useEffect(() => {
    const latest = readLatestAppointmentsCache();
    if (latest?.data) {
      setUserId(latest.data.userId || "");
      setHours(latest.data.hours || {});
      setLoading(false);
    }
    setHasHydratedInitialCache(true);
  }, []);

  useEffect(() => {
    if (!hasHydratedInitialCache) return;
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const cached = readAppointmentsCache(user.id);
        if (cached?.data) {
          setHours(cached.data.hours || {});
          setLoading(false);
        }
        const { data } = await supabase.from("sewist_working_hours").select("*").eq("user_id", user.id);
        
        const mappedHours: Record<number, any> = {};
        if (data) {
          data.forEach(row => {
            mappedHours[row.day_of_week] = {
              active: true,
              start_time: row.start_time.substring(0, 5), // e.g., 09:00
              end_time: row.end_time.substring(0, 5),
              slot_duration_minutes: row.slot_duration_minutes,
              max_customers_per_slot: row.max_customers_per_slot
            };
          });
        }
        setHours(mappedHours);
        writeAppointmentsCache(user.id, mappedHours);
      }
      setLoading(false);
    }
    load();
  }, [hasHydratedInitialCache]);

  const handleDayToggle = (day: number) => {
    setHours(prev => {
      const updated = { ...prev };
      if (updated[day]?.active) {
        updated[day] = { ...updated[day], active: false };
      } else {
        updated[day] = {
          active: true,
          start_time: "09:00",
          end_time: "17:00",
          slot_duration_minutes: 60,
          max_customers_per_slot: 1
        };
      }
      return updated;
    });
  };

  const handleTimeChange = (day: number, field: string, value: string | number) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Prepare upserts and deletes
    const toUpsert: any[] = [];
    const toDelete: number[] = [];

    DAYS.forEach(d => {
      const h = hours[d.value];
      if (h && h.active) {
        toUpsert.push({
          user_id: userId,
          day_of_week: d.value,
          start_time: `${h.start_time}:00`,
          end_time: `${h.end_time}:00`,
          slot_duration_minutes: h.slot_duration_minutes,
          max_customers_per_slot: h.max_customers_per_slot
        });
      } else {
        toDelete.push(d.value);
      }
    });

    if (toDelete.length > 0) {
      await supabase.from("sewist_working_hours")
        .delete()
        .eq("user_id", userId)
        .in("day_of_week", toDelete);
    }

    if (toUpsert.length > 0) {
      const { error } = await supabase.from("sewist_working_hours").upsert(toUpsert, {
        onConflict: 'user_id, day_of_week'
      });
      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }
    }

    alert("Schedule saved successfully!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:py-10 md:px-6 pb-32 md:pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-10 text-center md:text-left"
      >
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Availability</h1>
        <p className="text-gray-500 mt-2 text-base md:text-lg">Define your weekly schedule and slot capacity.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-medium text-gray-900">Weekly Hours</h2>
            <p className="text-xs md:text-sm text-gray-500">Set your recurring availability for commissions.</p>
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
          {/* Navigation Tabs */}
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-2 rounded-2xl relative">
            {DAYS.map((day) => {
              const isActive = activeDay === day.value;
              return (
                <button
                  key={day.value}
                  onClick={() => setActiveDay(day.value)}
                  className={`relative z-10 flex-1 py-3 text-xs font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDayIndicator"
                      className="absolute inset-0 bg-gray-200 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="flex flex-col items-center">
                    <span className="uppercase tracking-wider text-[10px] mb-0.5">{day.label.substring(0, 3)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {DAYS.map((day) => {
            const isActive = hours[day.value]?.active;
            return (
              <div 
                key={day.value} 
                className={`
                  flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-4 rounded-2xl transition-all duration-200
                  ${isActive ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-100 opacity-60'}
                `}
              >
                <div className="flex items-center gap-4 min-w-[140px]">
                  <input 
                    type="checkbox" 
                    id={`day-${day.value}`}
                    checked={!!isActive}
                    onChange={() => handleDayToggle(day.value)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`day-${day.value}`} className="font-medium text-gray-700 cursor-pointer select-none">
                    {day.label}
                  </label>
                </div>

                {isActive ? (
                  <div className="flex flex-wrap items-center gap-6 flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <input 
                        type="time" 
                        value={hours[day.value]?.start_time || "09:00"}
                        onChange={(e) => handleTimeChange(day.value, "start_time", e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light outline-none"
                      />
                      <span className="text-gray-400">-</span>
                      <input 
                        type="time" 
                        value={hours[day.value]?.end_time || "17:00"}
                        onChange={(e) => handleTimeChange(day.value, "end_time", e.target.value)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light outline-none"
                      />
                    </div>

                    <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1">Slot Duration</label>
                        <select 
                          value={hours[day.value]?.slot_duration_minutes || 60}
                          onChange={(e) => handleTimeChange(day.value, "slot_duration_minutes", parseInt(e.target.value))}
                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light outline-none"
                        >
                          <option value={30}>30 mins</option>
                          <option value={45}>45 mins</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Max per slot
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          max="10"
                          value={hours[day.value]?.max_customers_per_slot || 1}
                          onChange={(e) => handleTimeChange(day.value, "max_customers_per_slot", parseInt(e.target.value))}
                          className="w-20 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-light outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">Closed</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end">
          <PrimaryButton onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Schedule"}
          </PrimaryButton>
        </div>
      </motion.div>
      
      {/* Overrides section visual placeholder for future polish */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
      >
         <h2 className="text-xl font-medium text-gray-900 mb-2">Specific Date Overrides</h2>
         <p className="text-sm text-gray-500 mb-4">Block out vacations or add extra shifts on specific calendar dates.</p>
         <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
           Coming soon
         </div>
      </motion.div>
    </div>
  );
}
