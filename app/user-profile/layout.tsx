import Header from "@/global/Header";
import Footer from "@/global/Footer";
import UserProfileSidebar from "@/components/user-profile/sidebar";
import UserProfileMobileNav from "@/components/user-profile/mobile-nav";

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <UserProfileMobileNav />
      <div className="flex min-h-screen bg-white">
        <UserProfileSidebar />
        <main className="flex-1 p-4 sm:p-8 md:p-12">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
