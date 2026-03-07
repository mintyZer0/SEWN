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
    .from("public.profiles")
    .select("email")
    .eq("email", data.email)
    .single();

  if (existingUser) {
    console.log(existingUser);
    return {
      success: false,
      error: "An account with this email already exists.",
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

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        role: "sewer",
        first_name: firstName,
        last_name: lastName,
        email: formData.get("email") as string,
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

  const { data: existingUser } = await supabase
    .from("public.profiles")
    .select("email")
    .eq("email", data.email)
    .single();

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists.",
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

async function getRedirectTo() {
  // If NEXT_PUBLIC_SITE_URL is set, use it.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, "")}/auth/callback`;
  }

  // Otherwise, construct it dynamically from headers for environmental-agnosticism.
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  
  return `${protocol}://${host}/auth/callback`;
}

export async function signInWithOAuth(provider: "google" | "facebook" | "twitter") {
  const supabase = await createClient();
  const redirectTo = await getRedirectTo();

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
