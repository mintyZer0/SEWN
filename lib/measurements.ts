"use server";

import { createClient } from "@/utils/supabase/server";
import { MeasurementData } from "@/components/user-profile/measurement-card";
import { revalidatePath } from "next/cache";

export interface MeasurementProfile {
  id: string;
  user_id: string;
  title: string;
  data: MeasurementData;
  created_at?: string;
}

//
//Sample data structure for measurements cause we have no table yet
//
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
export async function createMeasurement(title: string, data: MeasurementData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data: newEntry, error } = await supabase
    .from("user_measurements")
    .insert([{ user_id: user.id, title, data }])
    .select()
    .single();

  if (!error) revalidatePath("/user-profile/measurements");
  return { data: newEntry, error };
}

/**
 * Updates an existing measurement profile.
 */
export async function updateMeasurement(
  id: string,
  title: string,
  data: MeasurementData,
) {
  const supabase = await createClient();

  const { data: updatedEntry, error } = await supabase
    .from("user_measurements")
    .update({ title, data })
    .eq("id", id)
    .select()
    .single();

  if (!error) revalidatePath("/user-profile/measurements");
  return { data: updatedEntry, error };
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
