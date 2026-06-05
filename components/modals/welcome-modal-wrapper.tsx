import { createClient } from "@/utils/supabase/server";
import { WelcomeModal } from "./welcome-modal";

export async function WelcomeModalWrapper() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch the user's profile to check the flag and get the name
  const { data: profile } = await supabase
    .from("users")
    .select("first_name, has_seen_welcome")
    .eq("id", user.id)
    .single();

  if (!profile || profile.has_seen_welcome) {
    return null;
  }

  return <WelcomeModal firstName={profile.first_name || ""} />;
}