"use client";

import SewistHeader from "@/global/SewistHeader";
import Footer from "@/global/Footer";
import SewistSidebar from "@/components/sewist-profile/sewist-sidebar";
import SewistMobileNav from "@/components/sewist-profile/sewist-mobile-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

export default function SewistDashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  // Robust check for chat page across subdomains and main domain
  const isChatPage = pathname === "/chat" || pathname?.endsWith("/chat");

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
      {/* Fixed Header */}
      <div className="shrink-0 z-50">
        <SewistHeader />
      </div>
      
      {/* Section Banner - Hidden on mobile chat only */}
      <div className={cn(
        "flex items-center justify-center py-4 md:py-10 text-4xl md:text-8xl text-third font-bold bg-white text-center px-4 uppercase tracking-wider shrink-0 border-b border-secondary/20",
        isChatPage && "hidden md:flex"
      )}>
        Sewist Center
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 items-stretch bg-secondary/30 relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <SewistSidebar unreadCount={unreadCount} />
        </div>

        {/* Dynamic content area */}
        <main className={cn(
          "flex-1 flex flex-col min-w-0 relative",
          // Add padding bottom on mobile only when NOT on chat room to avoid overlap with MobileNav
          !isChatPage && "pb-[72px] md:pb-0"
        )}>
          {children}
        </main>
      </div>
      
      {/* Footer - Hidden on mobile chat only */}
      <div className={cn(
        "hidden md:block shrink-0",
        isChatPage && "md:hidden"
      )}>
        <Footer variant="sewist" />
      </div>

      {/* Mobile Bottom Navigation - Hidden on mobile chat room handled by ChatContainer overlay */}
      <SewistMobileNav unreadCount={unreadCount} />
    </div>
  );
}
