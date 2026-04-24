"use server";

import { headers } from "next/headers";

import { isSameOriginRequest } from "@/lib/security/csrf";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createClient } from "@/utils/supabase/server";

const GENERIC_ADMIN_ERROR = "Unable to process admin request.";
const ADMIN_RATE_LIMIT_ERROR = "Too many admin actions. Please retry shortly.";

async function requireAdmin() {
  const headerList = await headers();
  if (!isSameOriginRequest(headerList)) {
    return { ok: false as const, error: "Forbidden" };
  }

  const rate = checkRateLimit(headerList, "admin-actions", 120, 60_000);
  if (!rate.allowed) {
    return { ok: false as const, error: ADMIN_RATE_LIMIT_ERROR };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false as const, error: "Unauthorized" };
  }

  let isAdmin =
    user.user_metadata?.role === "admin" ||
    user.user_metadata?.user_type === "admin";

  if (!isAdmin) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { ok: false as const, error: GENERIC_ADMIN_ERROR };
    }

    isAdmin = profile?.user_type === "admin";
  }

  if (!isAdmin) {
    return { ok: false as const, error: "Forbidden" };
  }

  return { ok: true as const, supabase, userId: user.id };
}

function auditAdminAction(action: string, adminId: string, targetId: string) {
  console.info(`[ADMIN_ACTION] action=${action} admin=${adminId} target=${targetId}`);
}

export async function approveOrder(id: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const { supabase } = guard;
  auditAdminAction("approve_order", guard.userId, id);
  const { error } = await supabase
    .from("orders")
    .update({ status: "accepted" })
    .eq("id", id);
  
  if (error) return { success: false, error: GENERIC_ADMIN_ERROR };
  return { success: true };
}

export async function rejectOrder(id: string, reason: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const { supabase } = guard;
  auditAdminAction("reject_order", guard.userId, id);
  const { error } = await supabase
    .from("orders")
    .update({ status: "declined" }) // Using declined based on existing types
    .eq("id", id);
  
  if (error) return { success: false, error: GENERIC_ADMIN_ERROR };
  // Optionally store the reason somewhere
  return { success: true };
}

export async function approveProduct(id: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const { supabase } = guard;
  auditAdminAction("approve_product", guard.userId, id);
  const { error } = await supabase
    .from("sewist_products")
    .update({ 
      verification_status: "approved",
      latest_rejection_log_id: null 
    })
    .eq("id", id);
  
  if (error) return { success: false, error: GENERIC_ADMIN_ERROR };
  return { success: true };
}

export async function rejectProduct(id: string, reasonCode: string, comment: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };
  
  const { supabase, userId } = guard;
  auditAdminAction("reject_product", userId, id);
  
  // 1. Create Log
  const { data: log, error: logError } = await supabase
    .from('product_rejection_logs')
    .insert({
      product_id: id,
      admin_id: userId,
      reason_code: reasonCode,
      custom_comment: comment
    })
    .select()
    .single();

  if (logError) return { success: false, error: GENERIC_ADMIN_ERROR };

  // 2. Update Product
  const { error: productError } = await supabase
    .from("sewist_products")
    .update({ 
      verification_status: "rejected",
      latest_rejection_log_id: log.id 
    })
    .eq("id", id);
  
  if (productError) return { success: false, error: GENERIC_ADMIN_ERROR };
  return { success: true };
}

export async function approveSewist(id: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const { supabase } = guard;
  auditAdminAction("approve_sewist", guard.userId, id);
  const { error } = await supabase
    .from("sewist_verifications")
    .upsert(
      {
        user_id: id,
        verification_status: "verified",
      },
      { onConflict: "user_id" }
    );
  
  if (error) return { success: false, error: GENERIC_ADMIN_ERROR };
  return { success: true };
}

export async function rejectSewist(id: string, reason: string) {
  const guard = await requireAdmin();
  if (!guard.ok) return { success: false, error: guard.error };

  const { supabase } = guard;
  auditAdminAction("reject_sewist", guard.userId, id);
  const { error } = await supabase
    .from("sewist_verifications")
    .upsert(
      {
        user_id: id,
        verification_status: "rejected",
      },
      { onConflict: "user_id" }
    );
  
  if (error) return { success: false, error: GENERIC_ADMIN_ERROR };
  return { success: true };
}
