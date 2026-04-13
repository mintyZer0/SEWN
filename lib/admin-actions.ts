"use server";

import { createClient } from "@/utils/supabase/server";

export async function approveOrder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "accepted" })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectOrder(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "declined" }) // Using declined based on existing types
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  // Optionally store the reason somewhere
  return { success: true };
}

export async function approveProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("seller_products")
    .update({ is_active: true })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectProduct(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("seller_products")
    .update({ is_active: false })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function approveSewer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sewer_verifications")
    .update({ verification_status: "verified" })
    .eq("user_id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectSewer(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sewer_verifications")
    .update({ verification_status: "rejected" })
    .eq("user_id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}
