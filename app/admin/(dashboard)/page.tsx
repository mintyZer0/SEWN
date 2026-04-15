import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { AdminTopCategories } from "@/components/admin/admin-top-categories";
import { AdminTrafficSources } from "@/components/admin/admin-traffic-sources";
import { AdminActiveUsers } from "@/components/admin/admin-active-users";
import { AdminConversionRate } from "@/components/admin/admin-conversion-rate";
import { 
  ShoppingBag, 
  PhilippinePeso, 
  Search
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Sales",
      value: "PHP1,259,252,355",
      change: "+5.34%",
      isPositive: true,
      icon: PhilippinePeso,
      href: "/orders",
    },
    {
      title: "Total Orders",
      value: "2,563",
      change: "+5.34%",
      isPositive: true,
      icon: ShoppingBag,
      href: "/orders",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 w-full max-w-[1400px] mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Dashboard</h1>
          <button className="px-6 py-2 rounded-xl bg-orchid text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md">
            This week
          </button>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/70">
              <Search size={18} />
              <span className="ml-2 text-sm font-medium">Search</span>
            </div>
            <div className="bg-primary/80 rounded-full pl-24 pr-2 py-1.5 flex items-center">
              <input 
                type="text" 
                className="w-64 h-8 rounded-full bg-white px-4 outline-none text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <AdminStatCard key={i} {...stat} />
            ))}
          </div>

          {/* Revenue Chart */}
          <AdminRevenueChart />

          {/* Bottom Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminActiveUsers />
            <AdminConversionRate />
          </div>

        </div>

        {/* Right Column (Side Widgets) */}
        <div className="flex flex-col gap-6">
          <AdminTopCategories />
          <AdminTrafficSources />
        </div>
      </div>
    </div>
  );
}
