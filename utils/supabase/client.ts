import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export function createClient() {
  const client = supabase;

  // Ensure we only wrap once
  if (!(client.auth as any)._isWrapped) {
    const originalGetUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = async (...args) => {
      try {
        return await originalGetUser(...args);
      } catch (error: any) {
        if (error?.message?.includes("Invalid UTF-8") || error?.message?.includes("base64") || error?.name === "TypeError") {
          // Fallback safely for corrupted session cookies
          return { data: { user: null }, error: new Error("Session corrupted") as any };
        }
        throw error;
      }
    };

    const originalGetSession = client.auth.getSession.bind(client.auth);
    client.auth.getSession = async () => {
      try {
        return await originalGetSession();
      } catch (error: any) {
        if (error?.message?.includes("Invalid UTF-8") || error?.message?.includes("base64") || error?.name === "TypeError") {
          return { data: { session: null }, error: new Error("Session corrupted") as any };
        }
        throw error;
      }
    };

    (client.auth as any)._isWrapped = true;
  }

  return client;
}