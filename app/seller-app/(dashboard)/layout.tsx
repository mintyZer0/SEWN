import SellerHeader from "@/global/SellerHeader";
import Footer from "@/global/Footer";
import SewerSidebar from "@/components/sewer-profile/sewer-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SellerLayout({
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

  if (error || userData?.user_type !== "seller") {
    redirect("/signup");
  }

  const { data: verification } = await supabase
    .from("sewer_verifications")
    .select("verification_status")
    .eq("user_id", user.id)
    .single();

  if (verification?.verification_status !== "verified") {
    redirect("/login?error=must_be_verified");
  }

  return (
    <>
      <SellerHeader />
      <div className="flex items-center justify-center py-10 text-8xl text-third font-light bg-white">
        SEWER CENTER
      </div>
      <div className="flex bg-[#FFF5CD]/30 min-h-screen">
        <SewerSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer variant="seller" />
    </>
  );
}
