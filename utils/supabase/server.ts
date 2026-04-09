import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

export async function createClient() {
  const cookieStore = await cookies();
  const host = (await headers()).get("host") || "";
  const domain = host.includes("sewn.local") ? ".sewn.local" : undefined;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ 
                name, 
                value, 
                ...options,
                domain: name.startsWith("sb-") ? domain : options.domain 
              }),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}

export async function uploadProductImage(
  supabase: ReturnType<typeof createServerClient>,
  file: File,
  productId: string,
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${productId}.${fileExt}`;
  const filePath = `${productId}/${fileName}`; // Product-specific folder

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl;
}
