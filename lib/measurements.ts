"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { isSameOriginRequest } from "@/lib/security/csrf";
import { checkRateLimit } from "@/lib/security/rate-limit";

export interface MeasurementProfile {
  id: string;
  user_id: string;
  profile_name: string;
  unit: string;
  chest: number | null;
  shoulder_width: number | null;
  neck: number | null;
  sleeve_length_short: number | null;
  sleeve_length_long: number | null;
  upper_arm_bicep: number | null;
  wrist: number | null;
  shirt_length: number | null;
  waist_shirt: number | null;
  waist_pants: number | null;
  hips: number | null;
  inseam: number | null;
  outseam: number | null;
  thigh: number | null;
  knee: number | null;
  leg_opening: number | null;
  front_rise: number | null;
  back_rise: number | null;
  created_at?: string;
  updated_at?: string;
}

export type MeasurementData = Omit<MeasurementProfile, "id" | "user_id" | "created_at" | "updated_at">;
const GENERIC_MEASUREMENT_ERROR = "Unable to process measurement request.";

async function enforceMeasurementAction(action: string): Promise<boolean> {
  const headerList = await headers();
  if (!isSameOriginRequest(headerList)) {
    return false;
  }

  const rate = checkRateLimit(headerList, action, 120, 60_000);
  return rate.allowed;
}

/**
 * Fetches all measurements for the current authenticated user.
 */
export async function getMeasurements() {
  const isAllowed = await enforceMeasurementAction("measurements-read");
  if (!isAllowed) return { data: null, error: "Unable to process request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("user_measurements")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return { data: data as MeasurementProfile[], error };
}

/**
 * Creates a new measurement profile.
 */
export async function createMeasurement(profile_name: string, data: Partial<MeasurementData>) {
  const isAllowed = await enforceMeasurementAction("measurements-create");
  if (!isAllowed) return { data: null, error: "Unable to process request." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data: newEntry, error } = await supabase
    .from("user_measurements")
    .insert([{ 
      user_id: user.id, 
      profile_name, 
      unit: "in", // Hardcoded to inches as requested
      ...data 
    }])
    .select()
    .single();

  if (!error) revalidatePath("/user-profile/measurements");
  return { data: newEntry as MeasurementProfile, error };
}

/**
 * Updates an existing measurement profile.
 */
export async function updateMeasurement(
  id: string,
  data: Partial<MeasurementData>,
) {
  const isAllowed = await enforceMeasurementAction("measurements-update");
  if (!isAllowed) return { data: null, error: new Error(GENERIC_MEASUREMENT_ERROR) as any };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data: updatedEntry, error } = await supabase
    .from("user_measurements")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { data: null, error: new Error(GENERIC_MEASUREMENT_ERROR) as any };
  if (!error) revalidatePath("/user-profile/measurements");
  return { data: updatedEntry as MeasurementProfile, error };
}

/**
 * Deletes a measurement profile.
 */
export async function deleteMeasurement(id: string) {
  const isAllowed = await enforceMeasurementAction("measurements-delete");
  if (!isAllowed) return { error: new Error(GENERIC_MEASUREMENT_ERROR) as any };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("user_measurements")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: new Error(GENERIC_MEASUREMENT_ERROR) as any };
  if (!error) revalidatePath("/user-profile/measurements");
  return { error };
}
