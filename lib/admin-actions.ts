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
    .update({ 
      verification_status: "approved",
      latest_rejection_log_id: null 
    })
    .eq("id", id);
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectProduct(id: string, reasonCode: string, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };
  
  // 1. Create Log
  const { data: log, error: logError } = await supabase
    .from('product_rejection_logs')
    .insert({
      product_id: id,
      admin_id: user.id,
      reason_code: reasonCode,
      custom_comment: comment
    })
    .select()
    .single();

  if (logError) return { success: false, error: logError.message };

  // 2. Update Product
  const { error: productError } = await supabase
    .from("seller_products")
    .update({ 
      verification_status: "rejected",
      latest_rejection_log_id: log.id 
    })
    .eq("id", id);
  
  if (productError) return { success: false, error: productError.message };
  return { success: true };
}

export async function approveSewer(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sewer_verifications")
    .upsert(
      {
        user_id: id,
        verification_status: "verified",
      },
      { onConflict: "user_id" }
    );
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function rejectSewer(id: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("sewer_verifications")
    .upsert(
      {
        user_id: id,
        verification_status: "rejected",
      },
      { onConflict: "user_id" }
    );
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}
