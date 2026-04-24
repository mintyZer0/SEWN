import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

function isLocalHost(host: string) {
  return (
    host.includes("localhost") ||
    host.startsWith("127.") ||
    host.endsWith(".local") ||
    host.includes(".local:")
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  const host = (await headers()).get("host") || "";
  const domain = host.includes("sewn.local") ? ".sewn.local" : undefined;
  const shouldSecure = !isLocalHost(host);

  const supabase = createServerClient(
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
                path: options.path ?? "/",
                sameSite: options.sameSite ?? "lax",
                httpOnly: options.httpOnly ?? true,
                secure: options.secure ?? shouldSecure,
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

  // Wrap auth methods to mitigate "Invalid UTF-8 sequence" malformed cookie errors
  const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
  supabase.auth.getUser = async (...args) => {
    try {
      return await originalGetUser(...args);
    } catch (error: any) {
      if (error?.message?.includes("Invalid UTF-8") || error?.message?.includes("base64") || error?.name === "TypeError") {
        return { data: { user: null }, error: new Error("Session corrupted") as any };
      }
      throw error;
    }
  };

  const originalGetSession = supabase.auth.getSession.bind(supabase.auth);
  supabase.auth.getSession = async () => {
    try {
      return await originalGetSession();
    } catch (error: any) {
      if (error?.message?.includes("Invalid UTF-8") || error?.message?.includes("base64") || error?.name === "TypeError") {
        return { data: { session: null }, error: new Error("Session corrupted") as any };
      }
      throw error;
    }
  };

  return supabase;
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
