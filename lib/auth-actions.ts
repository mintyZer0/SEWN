"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message === "Email not confirmed") {
      redirect("/auth/login?error=email_not_confirmed");
    }
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginSewer(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    if (error.message === "Email not confirmed") {
      redirect("/login?error=email_not_confirmed");
    }
    redirect("/error");
  }

  // Check if the user is actually a seller
  const { data: profile } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", authData.user.id)
    .single();

  if (profile && profile.user_type === "buyer") {
    // Force sign out if they are just a buyer trying to use the seller login
    await supabase.auth.signOut();
    redirect("/login?error=must_register_as_sewer");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        role: "buyer",
        first_name: firstName,
        last_name: lastName,
        email: formData.get("email") as string,
        phone_number: formData.get("phone-number") as string,
        landline_number: formData.get("landline") as string,
        address_line: formData.get("customer-address") as string,
        province: formData.get("province") as string,
        city: formData.get("city") as string,
      },
    },
  };

  const { data: existingUser } = await supabase
    .from("users")
    .select("email, user_type")
    .eq("email", data.email)
    .single();

  if (existingUser) {
    if (existingUser.user_type === "seller") {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }
    // If they are a buyer, they should probably go through the sewer signup flow 
    // to update their status, but if they are here, we handle it.
    return {
      success: false,
      error: "This email is registered as a customer. Please sign up as a Sewer to upgrade.",
    };
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.status);
    console.log(error.code);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signUpAsSewer(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  // 1. Check if user already exists in public.users (Buyer account)
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, user_type")
    .eq("email", email)
    .single();

  if (existingUser) {
    if (existingUser.user_type === "seller") {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    // 2. If they are a buyer, check if they are logged in to upgrade
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || session.user.email !== email) {
      return {
        success: false,
        error: "This email is already registered as a customer. Please login first, then come back here to upgrade your account to a Sewer.",
      };
    }

    console.log("Upgrading existing buyer account to seller:", existingUser.id);
    const { error: updateError } = await supabase
      .from("users")
      .update({ 
        user_type: "seller",
        first_name: firstName,
        last_name: lastName
      })
      .eq("id", existingUser.id);

    if (updateError) return { success: false, error: updateError.message };
    
    // Also update auth metadata
    await supabase.auth.updateUser({
      data: { role: "seller" }
    });

    revalidatePath("/", "layout");
    return { success: true };
  }

  // 3. If new user, proceed with standard signup
  const data = {
    email: email,
    password: formData.get("password") as string,
    options: {
      data: {
        role: "seller",
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: formData.get("phone-number") as string,
        landline_number: formData.get("landline") as string,
        address_line: formData.get("customer-address") as string,
        province: formData.get("province") as string,
        city: formData.get("city") as string,
        company_name: formData.get("company-name") as string,
        company_email: formData.get("company-email") as string,
        tax_id: formData.get("tax-id") as string,
        social_link: formData.get("social-link") as string,
        dti_sec_number: formData.get("dti-sec-number") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function upgradeToSewer(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Capture All Form Data
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const middleName = formData.get("middle-name") as string;
  const suffix = formData.get("suffix") as string;
  const shopName = formData.get("shop-name") as string;
  const businessEmail = formData.get("business-email") as string;
  const businessPhone = formData.get("business-phone") as string;
  const location = formData.get("location") as string;
  const zipCode = formData.get("zip-code") as string;
  const registeredAddress = formData.get("address") as string;
  const sellerType = formData.get("seller-type") as string;
  const tin = formData.get("tin") as string;
  const vatStatus = formData.get("vat-status") as string;
  const swornDecl = formData.get("sworn-decl") as string;

  // File Captures (Future: Upload to Supabase Storage)
  const businessDoc = formData.get("business-doc") as File;
  const govId = formData.get("gov-id") as File;
  const birCert = formData.get("bir-cert") as File;

  console.log("Upgrading user with data:", { 
    id: user.id, 
    shopName, 
    sellerType, 
    tin, 
    location,
    hasBusinessDoc: !!businessDoc?.size,
    hasGovId: !!govId?.size,
    hasBirCert: !!birCert?.size
  });

  // 2. Update Core User Info
  const { error: userError } = await supabase
    .from("users")
    .update({ 
      user_type: "seller",
      first_name: firstName,
      last_name: lastName
      // Future: add middle_name, suffix to schema if needed
    })
    .eq("id", user.id);

  if (userError) {
    console.error("User upgrade error:", userError.message);
    redirect("/error");
  }

  // 3. Add/Update Registered Address
  // Format location: "Region / Province / City / Barangay"
  const parts = location.split(" / ").map(s => s.trim());
  const [region, province, city, barangay] = parts;

  await supabase.from("user_addresses").upsert({
    user_id: user.id,
    full_address: registeredAddress,
    city: city || "",
    province: province || region || "",
    barangay: barangay || "",
    zip_code: parseInt(zipCode) || 0,
    is_primary: true
  }, { onConflict: "user_id, is_primary" });

  // 4. Update Auth Metadata
  await supabase.auth.updateUser({
    data: { 
      role: "seller",
      shop_name: shopName,
      seller_type: sellerType,
      tin: tin,
      vat_status: vatStatus
    }
  });

  revalidatePath("/", "layout");
  redirect("/");
}

async function getRedirectTo(role?: "customer" | "sewer", intent?: "login" | "signup") {
  // Otherwise, construct it dynamically from headers for environmental-agnosticism.
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") || (host?.includes("localhost") || host?.includes(".local") ? "http" : "https");
  
  // If no host is found, fallback to sewn.local
  const base = host ? `${protocol}://${host}` : `${protocol}://sewn.local:3000`;
  
  let url = `${base}/auth/callback`;
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (intent) params.set("intent", intent);
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

export async function signInWithOAuth(provider: "google" | "facebook" | "twitter", role?: "customer" | "sewer", intent?: "login" | "signup") {
  const supabase = await createClient();
  const redirectTo = await getRedirectTo(role, intent);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      queryParams:
        provider === "google"
          ? {
              access_type: "offline",
              prompt: "consent",
            }
          : {},
      redirectTo,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function signInWithGoogle() {
  return signInWithOAuth("google");
}

export async function signInWithFacebook() {
  return signInWithOAuth("facebook");
}

export async function signInWithTwitter() {
  return signInWithOAuth("twitter");
}

export async function signInWithGoogleSewer(intent: "login" | "signup" = "login") {
  return signInWithOAuth("google", "sewer", intent);
}

export async function signInWithFacebookSewer(intent: "login" | "signup" = "login") {
  return signInWithOAuth("facebook", "sewer", intent);
}

export async function signInWithTwitterSewer(intent: "login" | "signup" = "login") {
  return signInWithOAuth("twitter", "sewer", intent);
}
