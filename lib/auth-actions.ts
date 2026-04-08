"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

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

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message === "Email not confirmed") {
      redirect("/login?error=email_not_confirmed");
    }
    if (error.message === "Invalid login credentials") {
      redirect("/login?error=invalid_credentials");
    }
    redirect("/login?error=unknown_error");
  }

  // Check if the user is actually a seller
  const { data: profile } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", authData.user.id)
    .single();

  if (profile && profile.user_type === "buyer") {
    redirect("/onboarding");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const { data: existingUser } = await supabase
    .from("users")
    .select("email, user_type")
    .ilike("email", email)
    .single();

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in.",
    };
  }

  const headerList = await headers();
  let base = headerList.get("origin");
  const host = headerList.get("host");
  
  if (!base) {
    const protocol = headerList.get("x-forwarded-proto") || (host?.includes("localhost") || host?.includes(".local") ? "http" : "https");
    base = host ? `${protocol}://${host}` : `${protocol}://sewn.local:3000`;
  }

  console.log("Signup URL Construction:", { origin: headerList.get("origin"), host, base });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${base}/auth/confirm`,
      data: {
        role: "buyer",
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: formData.get("phone-number") as string,
        landline_number: formData.get("landline") as string,
        address_line: formData.get("customer-address") as string,
        province: formData.get("province") as string,
        city: formData.get("city") as string,
        address_type: "shipping"
      },
    },
  });

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

  const email = (formData.get("email") as string).trim().toLowerCase();
  const password = formData.get("password") as string;

  // 1. Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, user_type")
    .ilike("email", email)
    .single();

  if (existingUser) {
    if (existingUser.user_type === "seller") {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    // 2. If they are a buyer, try to log them in automatically
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        success: false,
        error: "This email is already registered as a customer, but the password provided is incorrect. Please provide your correct password to upgrade your account to a Sewer.",
      };
    }
  } else {
    // 3. New user -> sign up
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: "seller",
          user_type: "seller",
          username: formData.get("username") as string,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  // 4. Now that they are authenticated (new or existing), use upgradeToSewer logic to save the profile data
  return await upgradeToSewer(formData);
}

export async function upgradeToSewer(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  // 1. Capture All Form Data (Handling both Modal and Onboarding field names)
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const shopName = (formData.get("shop-name") || formData.get("company-name")) as string;
  const location = formData.get("location") as string;
  const zipCode = formData.get("zip-code") as string;
  const registeredAddress = (formData.get("address") || formData.get("customer-address")) as string;
  const taxId = (formData.get("tax-id") || formData.get("tin")) as string;
  const birthday = formData.get("birthday") as string;
  const gender = formData.get("gender") as string;

  // 2. Update Core User Info
  const { error: userError } = await supabase
    .from("users")
    .update({ 
      user_type: "seller",
      first_name: firstName,
      last_name: lastName,
      birthday: birthday || null,
      gender: gender as any
    })
    .eq("id", user.id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  // 3. Add/Update Registered Address
  let finalCity = "";
  let finalProvince = "";
  let finalBarangay = "";

  if (location) {
    const parts = location.split(" / ").map(s => s.trim());
    const [region, province, city, barangay] = parts;
    finalProvince = province || region || "";
    finalCity = city || "";
    finalBarangay = barangay || "";
  } else {
    finalCity = formData.get("city") as string;
    finalProvince = formData.get("province") as string;
  }

  // Check if they already have a shop address to update it
  const { data: existingShopAddress } = await supabase
    .from("user_addresses")
    .select("id, is_primary")
    .eq("user_id", user.id)
    .eq("address_type", "shop")
    .maybeSingle();

  // For role-specific primaries, the shop address should be primary for the 'shop' type.
  // If it's a new shop address, we set it to true. 
  // If it's an existing one, we keep its current primary status.
  const isPrimary = existingShopAddress ? existingShopAddress.is_primary : true;

  const addressData: any = {
    user_id: user.id,
    full_address: registeredAddress,
    city: finalCity || "",
    province: finalProvince || "",
    barangay: finalBarangay || "",
    zip_code: parseInt(zipCode) || 0,
    is_primary: isPrimary,
    address_type: "shop"
  };

  if (existingShopAddress) {
    addressData.id = existingShopAddress.id;
  }

  const { error: addressError } = await supabase.from("user_addresses").upsert(addressData);

  if (addressError) {
    console.error("Address Error:", addressError);
    return { success: false, error: addressError.message };
  }

  // 4. Update Auth Metadata
  await supabase.auth.updateUser({
    data: { 
      role: "seller",
      shop_name: shopName,
      tax_id: taxId
    }
  });

  // 5. Upsert into sewer_verifications
  const { error: verificationError } = await supabase.from("sewer_verifications").upsert({
    user_id: user.id,
    tax_id: taxId,
    dti_sec_number: formData.get("dti-sec-number") as string,
  }, { onConflict: "user_id" });

  if (verificationError) {
    return { success: false, error: verificationError.message };
  }

  // 6. Upsert into sewer_onboarding_surveys
  const { error: surveyError } = await supabase.from("sewer_onboarding_surveys").upsert({
    user_id: user.id,
    educational_attainment: (formData.get("educational-attainment") || formData.get("education")) as string,
    monthly_income: (formData.get("monthly-income") || formData.get("income")) as string,
    reason_for_sewing: (formData.get("why-sew") || formData.get("whySew")) as string,
    favorite_aspect: (formData.get("like-sewing") || formData.get("likeSewing")) as string,
    gives_pride: (formData.get("give-pride") || formData.get("givePride")) as string,
    expresses_self: (formData.get("express-yourself") || formData.get("expressYourself")) as string,
    community_goals: formData.get("goals") as string,
    learn_method: (formData.get("learn-craft") || formData.get("learnCraft")) as string,
    teacher_relationship: (formData.get("who-taught") || formData.get("whoTaught")) as string,
    motivations: formData.get("motivations") as string,
    is_only_livelihood: (formData.get("only-livelihood") || formData.get("onlyLivelihood")) as string,
    owns_machine: (formData.get("own-machine") || formData.get("ownMachine")) as string,
    machine_owner: (formData.get("machine-owner") || formData.get("machineOwner")) as string,
    makes_traditional_products: (formData.get("traditional-products") || formData.get("traditionalProducts")) as string,
    common_products_used_for: (formData.get("products-used-for") || formData.get("productsUsedFor")) as string,
    specific_products: (formData.get("specific-products") || formData.get("specificProducts")) as string,
    designs_garments: (formData.get("design-products") || formData.get("designProducts")) as string,
  }, { onConflict: "user_id" });

  if (surveyError) {
    return { success: false, error: surveyError.message };
  }

  // 7. Ensure sewer_settings and sewer_statistics exist
  await Promise.all([
    supabase.from("sewer_settings").upsert({ user_id: user.id }, { onConflict: "user_id" }),
    supabase.from("sewer_statistics").upsert({ user_id: user.id }, { onConflict: "user_id" })
  ]);

  // 8. Insert social link if provided
  const socialLink = formData.get("social-link") as string;
  if (socialLink) {
    await supabase.from("user_socials").upsert({
      user_id: user.id,
      platform: "Other",
      handle: socialLink
    }, { onConflict: "user_id, platform" });
  }

  revalidatePath("/", "layout");
  return { success: true };
}

async function getRedirectTo(role?: "customer" | "sewer", intent?: "login" | "signup") {
  const headerList = await headers();
  let base = headerList.get("origin");
  
  if (!base) {
    const host = headerList.get("host");
    const protocol = headerList.get("x-forwarded-proto") || (host?.includes("localhost") || host?.includes(".local") ? "http" : "https");
    base = host ? `${protocol}://${host}` : `${protocol}://sewn.local:3000`;
  }
  
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