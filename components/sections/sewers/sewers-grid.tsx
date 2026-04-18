"use client";

import { useState, useEffect } from "react";
import SewerCard, { type Sewer } from "./sewer-card";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filters = Record<string, string[]>;

interface SewersGridProps {
  filters: Record<string, string[]>;
  type: "sewers";
}

export default function SewersGrid({filters, type}: SewersGridProps) {
  const [allSewers, setAllSewers] = useState<Sewer[]>([]);
  const [filteredSewers, setFilteredSewers] = useState<Sewer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"most-sold" | "highest-rated" | "most-experienced">(
    "most-sold"
  );

  const supabase = createClient();

  useEffect(() => {
    async function fetchSewers() {
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
            user_addresses (province, city, is_primary),
            sewer_statistics (rating_avg, total_orders_completed),
            sewer_settings (accepting_alterations, accepting_repairs, accepting_commissions),
            sewer_verifications (verification_status),
            sewer_achievements (title),
            sewer_onboarding_surveys (reason_for_sewing)
          `)
          .eq("user_type", "seller");

        if (error) {
          console.error("Database fetch error:", error.message);
          setAllSewers([]);
          setFilteredSewers([]);
          return;
        }

        if (!data || data.length === 0) {
          setAllSewers([]);
          setFilteredSewers([]);
          return;
        }

        const sewersToSet: Sewer[] = data.map((user: any) => {
          const stats = user.sewer_statistics?.[0];
          const settings = user.sewer_settings?.[0];
          const verification = user.sewer_verifications?.[0];
          const achievements = user.sewer_achievements || [];

          const primaryAddress =
            user.user_addresses?.find((addr: any) => addr.is_primary) ||
            user.user_addresses?.[0];

          const location =
            primaryAddress
              ? `${primaryAddress.city}${primaryAddress.province ? `, ${primaryAddress.province}` : ""}`
              : "Location not set";

          const avatarArray = user.user_avatars;
            const avatarObj = Array.isArray(avatarArray) ? avatarArray[0] : avatarArray;

            let avatarUrl = "/assets/sewer-photos/1.jpg";

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
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewer",
            location,
            img_src: avatarUrl || "/assets/sewer-photos/1.jpg",
            rating: stats?.rating_avg || 0,
            completed_orders: stats?.total_orders_completed || 0,
            services,
            years_of_experience: 0, // Still mocked
            is_verified: verification?.verification_status === "verified",
            is_tesda_certified: isTesda
          };
        });

        setAllSewers(sewersToSet);
        setFilteredSewers(sewersToSet);
      } catch (err) {
        console.error("Error fetching sewers:", err);
        setAllSewers([]);
        setFilteredSewers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSewers();
  }, [supabase]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allSewers];

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

    setFilteredSewers(result);
}, [filters, allSewers, sortBy]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-3xl font-bold text-gray-500">
        Loading sewers...
      </div>
    );
  }

  if (!isLoading && filteredSewers.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        No sewers found.
      </div>
    );
  }

  return (
    <div className="w-full p-2">
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl mx-5 font-bold text-gray-700">
          {filteredSewers.length} Sewers
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
        {filteredSewers.map((sewer) => (
          <SewerCard
            key={sewer.id}
            sewer={sewer}
          />
        ))}
      </div>
    </div>
  );
}