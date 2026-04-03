import Header from "@/global/Header";
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

  return (
    <>
      <Header variant="seller" />
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
