// components/sections/sewers/sewer-grid.tsx
"use client";

import { useState, useEffect } from "react";
import SewerCard, { type Sewer } from "./sewer-card";
import { createClient } from "@/utils/supabase/client";

type Filters = Record<string, string[]>;

interface SewersGridProps {
  filters: Filters;
  setIsChatWidgetOpen: (open: boolean) => void;
  setSelectedConversationId: (id: string | null) => void;
  setChatView: (view: "list" | "chat") => void;
}

export default function SewersGrid({
  filters,
  setIsChatWidgetOpen,
  setSelectedConversationId,
  setChatView,
}: SewersGridProps) {
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
            user_avatars (avatar_url),
            user_addresses (province, city, is_primary)
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

          const primaryAddress =
            user.user_addresses?.find((addr: any) => addr.is_primary) ||
            user.user_addresses?.[0];

          const location =
            primaryAddress
              ? `${primaryAddress.city}${primaryAddress.province ? `, ${primaryAddress.province}` : ""}`
              : user.location || "Location not set";

          const avatar = user.user_avatars?.[0]?.avatar_url;

          return {
            id: user.id,
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewer",
            location,
            img_src: avatar || "/assets/sewer-photos/1.jpg",
            rating: 5.0,
            completed_orders: 0,
            services: [],
            years_of_experience: 0,
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

    if (filters["Sewer Location"]?.length) {
      result = result.filter((s) =>
        filters["Sewer Location"].some((loc) => s.location.includes(loc))
      );
    }

    if (filters["search"]?.[0]) {
      const query = filters["search"][0].toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
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
          <select
            className="px-4 py-2 bg-primary-light rounded-lg border-none text-lg"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "most-sold" | "highest-rated" | "most-experienced")
            }
          >
            <option value="most-sold">Filter by most sold</option>
            <option value="highest-rated">Highest rated</option>
            <option value="most-experienced">Most experienced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto justify-items-center">
        {filteredSewers.map((sewer) => (
          <SewerCard
            key={sewer.id}
            sewer={sewer}
            setIsChatWidgetOpen={setIsChatWidgetOpen}
            setSelectedConversationId={setSelectedConversationId}
            setChatView={setChatView}
          />
        ))}
      </div>
    </div>
  );
}