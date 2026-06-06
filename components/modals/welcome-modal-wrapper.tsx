import { createClient } from "@/utils/supabase/server";
import { WelcomeModal } from "./welcome-modal";

export async function WelcomeModalWrapper() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError && !userError.message?.includes("Auth session missing")) {
    console.error("Error fetching user in WelcomeModalWrapper:", userError);
  }

  if (!user) {
    return null;
  }

  // Fetch the user's profile to check the flag and get the name
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("first_name, has_seen_welcome")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile in WelcomeModalWrapper:", profileError);
  }

  if (!profile || profile.has_seen_welcome) {
    return null;
  }

  return <WelcomeModal firstName={profile.first_name || ""} />;
}