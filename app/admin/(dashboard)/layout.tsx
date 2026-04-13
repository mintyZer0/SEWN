import Footer from "@/global/Footer";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles most of this, but we'll add a secondary check here for safety
  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (error || userData?.user_type !== "admin") {
    // If they are not an admin, redirect them back to the main site
    redirect("http://sewn.local:3000/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative z-0">
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer variant="orchid" />
    </div>
  );
}
