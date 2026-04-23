"use client";

import { useState, useEffect } from "react";
import SewistCard, { type Sewist } from "./sewist-card";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filters = Record<string, string[]>;

interface SewistsGridProps {
  filters: Record<string, string[]>;
  type: "sewists";
}

export default function SewistsGrid({filters, type}: SewistsGridProps) {
  const [allSewists, setAllSewists] = useState<Sewist[]>([]);
  const [filteredSewists, setFilteredSewists] = useState<Sewist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"most-sold" | "highest-rated" | "most-experienced">(
    "most-sold"
  );

  const supabase = createClient();

  useEffect(() => {
    async function fetchSewists() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select(`
            id,
            first_name,
            last_name,
            user_type,
            user_avatars (id, avatar_url),
            user_addresses (province, city, is_primary, address_type),
            sewist_statistics (rating_avg, total_orders_completed),
            sewist_settings (accepting_alterations, accepting_repairs, accepting_commissions),
            sewist_verifications (verification_status),
            sewist_achievements (title),
            sewist_onboarding_surveys (reason_for_sewing)
          `)
          .eq("user_type", "sewist");

        if (error) {
          console.error("Database fetch error:", error.message);
          setAllSewists([]);
          setFilteredSewists([]);
          return;
        }

        if (!data || data.length === 0) {
          setAllSewists([]);
          setFilteredSewists([]);
          return;
        }

        const sewistsToSet: Sewist[] = data.map((user: any) => {
          const stats = user.sewist_statistics?.[0];
          const settings = user.sewist_settings?.[0];
          const verification = user.sewist_verifications?.[0];
          const achievements = user.sewist_achievements || [];

          const addresses = Array.isArray(user.user_addresses)
            ? user.user_addresses
            : [user.user_addresses].filter(Boolean);
          const primaryAddress =
            addresses.find((addr: any) => addr.address_type === "shop" && addr.is_primary) ||
            addresses.find((addr: any) => addr.address_type === "shop") ||
            addresses.find((addr: any) => addr.is_primary) ||
            addresses[0];

          const location =
            primaryAddress
              ? `${primaryAddress.city}${primaryAddress.province ? `, ${primaryAddress.province}` : ""}`
              : "Location not set";

          const avatarArray = user.user_avatars;
            const avatarObj = Array.isArray(avatarArray) ? avatarArray[0] : avatarArray;

            let avatarUrl = "/assets/sewist-photos/1.jpg";

            if (avatarObj?.avatar_url) {
              const { data: publicData } = supabase.storage
                .from("product-images")
                .getPublicUrl(avatarObj.avatar_url);

              avatarUrl = publicData.publicUrl;
            }

          const services: string[] = [];
          if (settings?.accepting_repairs) services.push("Repair");
          if (settings?.accepting_alterations) services.push("Alteration");
          if (settings?.accepting_commissions) services.push("Commission");

          const isTesda = achievements.some((a: any) => 
            a.title?.toLowerCase().includes("tesda")
          );

          return {
            id: user.id,
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewist",
            location,
            img_src: avatarUrl || "/assets/sewist-photos/1.jpg",
            rating: stats?.rating_avg || 0,
            completed_orders: stats?.total_orders_completed || 0,
            services,
            years_of_experience: 0, // Still mocked
            is_verified: verification?.verification_status === "verified",
            is_tesda_certified: isTesda
          };
        });

        setAllSewists(sewistsToSet);
        setFilteredSewists(sewistsToSet);
      } catch (err) {
        console.error("Error fetching sewists:", err);
        setAllSewists([]);
        setFilteredSewists([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSewists();
  }, [supabase]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allSewists];

    if (filters["search"]?.[0]) {
      const query = filters["search"][0].toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    if (filters["Services"]?.length) {
    const selected = filters["Services"].map(s => s.toLowerCase());
      result = result.filter((s) =>
      s.services?.some(service =>
        filters["Services"].includes(service)
      )
    );
  }

  // EXPERIENCE (future-ready)
    if (filters["Experience"]?.length) {
      result = result.filter((s) => {
      // placeholder logic until you define ranges
      return true;
    });
  }

    switch (sortBy) {
    case "most-sold":
      result.sort((a, b) => (b.completed_orders || 0) - (a.completed_orders || 0));
      break;

    case "highest-rated":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;

    case "most-experienced":
      result.sort((a, b) => (b.years_of_experience || 0) - (a.years_of_experience || 0));
      break;
  }

    setFilteredSewists(result);
}, [filters, allSewists, sortBy]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-3xl font-bold text-gray-500">
        Loading sewists...
      </div>
    );
  }

  if (!isLoading && filteredSewists.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        No sewists found.
      </div>
    );
  }

  return (
    <div className="w-full p-2">
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl mx-5 font-bold text-gray-700">
          {filteredSewists.length} Sewists
        </span>
        <div className="mb-4 mx-4">
          <Select
            variant="purple"
            value={sortBy}
            onValueChange={(val) =>
              setSortBy(val as "most-sold" | "highest-rated" | "most-experienced")
            }
          >
            <SelectTrigger className="px-4 py-2 bg-primary-light rounded-lg border-none text-lg min-w-[200px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-sold">Filter by most sold</SelectItem>
              <SelectItem value="highest-rated">Highest rated</SelectItem>
              <SelectItem value="most-experienced">Most experienced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto justify-items-center">
        {filteredSewists.map((sewist) => (
          <SewistCard
            key={sewist.id}
            sewist={sewist}
          />
        ))}
      </div>
    </div>
  );
}
