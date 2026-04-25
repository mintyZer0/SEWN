// lib/appointment-actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}

export async function computeAvailableDays(
  year: number,
  month: number,
  workingHours: any[],
  overrides: any[],
  appointments: any[]
): Promise<DayAvailability[]> {
  const appointmentCounts: Record<string, number> = {};
  appointments.forEach(app => {
    const timeKey = new Date(app.start_time).toISOString();
    appointmentCounts[timeKey] = (appointmentCounts[timeKey] || 0) + 1;
  });

  const availableDays: DayAvailability[] = [];
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(Date.UTC(year, month - 1, i));
    // Skip past dates (only in production context, for tests we allow it if we mock today)
    // if (currentDate < new Date(new Date().setUTCHours(0,0,0,0))) continue;

    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getUTCDay();

    const override = overrides.find(o => o.override_date === dateStr);
    
    if (override && override.is_closed) {
      continue;
    }

    const defaultHours = workingHours.find(w => w.day_of_week === dayOfWeek);
    
    let startStr = override?.start_time || defaultHours?.start_time;
    let endStr = override?.end_time || defaultHours?.end_time;
    let duration = defaultHours?.slot_duration_minutes || 60;
    let maxCustomers = defaultHours?.max_customers_per_slot || 1;

    if (!startStr || !endStr) continue;

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    let currentSlot = new Date(currentDate);
    currentSlot.setUTCHours(startH, startM, 0, 0);

    const endSlot = new Date(currentDate);
    endSlot.setUTCHours(endH, endM, 0, 0);

    const slots: TimeSlot[] = [];

    while (currentSlot < endSlot) {
      const nextSlot = new Date(currentSlot.getTime() + duration * 60000);
      if (nextSlot > endSlot) break;

      const timeKey = currentSlot.toISOString();
      const bookedCount = appointmentCounts[timeKey] || 0;

      if (bookedCount < maxCustomers) {
        slots.push({
          startTime: currentSlot.toISOString(),
          endTime: nextSlot.toISOString()
        });
      }
      currentSlot = nextSlot;
    }

    if (slots.length > 0) {
      availableDays.push({ date: dateStr, slots });
    }
  }

  // Filter out past dates logic moved here so it works reliably
  const todayZeroed = new Date(new Date().setUTCHours(0,0,0,0));
  return availableDays.filter(day => new Date(day.date) >= todayZeroed);
}

export async function getAvailableSlots(sewistId: string, year: number, month: number): Promise<DayAvailability[]> {
  const supabase = await createClient();

  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(Date.UTC(year, month, 0)).toISOString(); // Last day of month

  const [workingHoursRes, overridesRes, appointmentsRes] = await Promise.all([
    supabase.from("sewist_working_hours").select("*").eq("user_id", sewistId),
    supabase.from("sewist_schedule_overrides").select("*").eq("user_id", sewistId).gte("override_date", startDate.split('T')[0]).lte("override_date", endDate.split('T')[0]),
    supabase.from("appointments").select("start_time").eq("sewist_id", sewistId).gte("start_time", startDate).lte("start_time", endDate).neq("status", "cancelled")
  ]);

  if (workingHoursRes.error || overridesRes.error || appointmentsRes.error) {
    throw new Error("Failed to fetch schedule data");
  }

  const workingHours = workingHoursRes.data || [];
  const overrides = overridesRes.data || [];
  const appointments = appointmentsRes.data || [];

  return computeAvailableDays(year, month, workingHours, overrides, appointments);
}
