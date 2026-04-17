"use client";

import React, { useState, useEffect } from "react";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { AdminTopCategories } from "@/components/admin/admin-top-categories";
import { AdminTrafficSources } from "@/components/admin/admin-traffic-sources";
import { AdminActiveUsers } from "@/components/admin/admin-active-users";
import { AdminConversionRate } from "@/components/admin/admin-conversion-rate";
import { 
  ShoppingBag, 
  PhilippinePeso, 
  Search,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    {
      title: "Total Sales",
      value: "PHP 0",
      change: "0%",
      isPositive: true,
      icon: PhilippinePeso,
      href: "/admin/orders",
    },
    {
      title: "Total Orders",
      value: "0",
      change: "0%",
      isPositive: true,
      icon: ShoppingBag,
      href: "/admin/orders",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        // 1. Fetch Total Sales
        const { data: orders } = await supabase
          .from('orders')
          .select('total')
          .neq('status', 'cancelled');
        
        const totalSales = orders?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0;
        
        // 2. Fetch Total Order Count
        const { count: totalOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });

        setStats([
          {
            title: "Total Sales",
            value: `PHP ${totalSales.toLocaleString()}`,
            change: "+0%", // Needs historical data for comparison
            isPositive: true,
            icon: PhilippinePeso,
            href: "/admin/orders",
          },
          {
            title: "Total Orders",
            value: (totalOrders || 0).toString(),
            change: "+0%",
            isPositive: true,
            icon: ShoppingBag,
            href: "/admin/orders",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

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
