import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SewistDashboardClientLayout from "./dashboard-client-layout";

export default async function SewistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (error || userData?.user_type !== "sewist") {
    redirect("/signup");
  }

  const { data: verification } = await supabase
    .from("sewist_verifications")
    .select("verification_status")
    .eq("user_id", user.id)
    .single();

  if (verification?.verification_status !== "verified") {
    redirect("/login?error=must_be_verified");
  }

  return (
    <SewistDashboardClientLayout>
      {children}
    </SewistDashboardClientLayout>
  );
}
