"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

/**
 * Fetches all measurements for the current authenticated user.
 */
export async function getMeasurements() {
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
  const supabase = await createClient();

  const { data: updatedEntry, error } = await supabase
    .from("user_measurements")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (!error) revalidatePath("/user-profile/measurements");
  return { data: updatedEntry as MeasurementProfile, error };
}

/**
 * Deletes a measurement profile.
 */
export async function deleteMeasurement(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_measurements")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/user-profile/measurements");
  return { error };
}
