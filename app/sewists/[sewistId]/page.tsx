import { notFound } from "next/navigation";
import SewistHeader from "@/components/sewist-profile/sewist-header";
import Services from "@/components/sewist-profile/services";
import Stats from "@/components/sewist-profile/stats";
import Products from "@/components/sewist-profile/products";
import AchievementsServices from "@/components/sewist-profile/achievements-services";
import SeparatorX from "@/components/ui/separator-x";
import Map from "@/components/sewist-profile/map";
import ContactSewist from "@/components/sewist-profile/contact-sewist";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: Promise<{
    sewistId: string;
  }>;
}

export default async function SewistPage({ params }: PageProps) {
  const { sewistId } = await params;
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select(`
      id,
      first_name,
      last_name,
      email,
      user_type,
      user_avatars (avatar_url),
      user_addresses (province, city, is_primary, address_type, latitude, longitude),
      user_phones (phone),
      sewist_achievements (title),
      sewist_statistics (rating_avg, profile_views_total, total_orders_completed),
      sewist_verifications (verification_status),
      sewist_settings (accepting_alterations, accepting_repairs, accepting_commissions)
    `)
    .eq("id", sewistId)
    .single();

  if (error || !user || user.user_type !== "sewist") {
    return notFound();
  }

  // Increment profile views in the background (Optional: track if requester is not the owner)
  try {
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData?.user;
    if (!authUser || authUser.id !== sewistId) {
      await supabase.rpc('increment_profile_views', { target_user_id: sewistId });
    }
  } catch (err) {
    console.error("View Tracking Error:", err);
  }

  const addresses = Array.isArray(user.user_addresses)
    ? user.user_addresses
    : [user.user_addresses].filter(Boolean);
  const shopAddress =
    addresses.find((addr: any) => addr.address_type === "shop" && addr.is_primary) ||
    addresses.find((addr: any) => addr.address_type === "shop") ||
    addresses.find((addr: any) => addr.is_primary) ||
    addresses[0];

  const location =
    shopAddress
      ? `${shopAddress.city}${shopAddress.province ? `, ${shopAddress.province}` : ""}`
      : "Location not set";
  const mapPosition = {
    lat: shopAddress?.latitude ?? 15.4753,
    lng: shopAddress?.longitude ?? 120.596,
  };

  const avatar = user.user_avatars?.[0]?.avatar_url || "/assets/sewist-photos/1.jpg";
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewist";

  // New logic for dynamic fields
  const stats = user.sewist_statistics?.[0];
  const verification = user.sewist_verifications?.[0];
  const bio = "This is a placeholder bio. Additional profile fields coming soon.";
  const rating = stats?.rating_avg || 0;
  const yearsOfExperience = 0; // Still mocked until 'started_sewing_at' is implemented
  const productsSewed = stats?.total_orders_completed || 0;
  
  const achievements = user.sewist_achievements?.map((a: any) => a.title) || [];
  const tesdaCertified = achievements.some(a => a.toLowerCase().includes("tesda"));

  const settingsArray = Array.isArray(user.sewist_settings) ? user.sewist_settings : [user.sewist_settings].filter(Boolean);
  const settings = settingsArray[0];
  const servicesOffered: ("repair" | "alteration" | "commission")[] = [];
  if (settings?.accepting_repairs) servicesOffered.push("repair");
  if (settings?.accepting_alterations) servicesOffered.push("alteration");
  if (settings?.accepting_commissions) servicesOffered.push("commission");

  const mobileNumber = user.user_phones?.[0]?.phone || "Phone not listed";

  return (
    <div className="py-12">
      <SewistHeader
        name={name}
        image={avatar}
        bio={bio}
        rating={rating}
        location={location}
        isVerified={verification?.verification_status === "verified"}
        isTesdaCertified={tesdaCertified}
      />
      <Services sewistId={sewistId} servicesOffered={servicesOffered} />
      <Stats
        yearsOfExperience={yearsOfExperience}
        rating={rating}
        productsSewed={productsSewed}
      />
      <Products sewistId={sewistId} />
      <SeparatorX />
      <AchievementsServices
        achievements={achievements}
        tesdaCertified={tesdaCertified}
      />
      <Map position={mapPosition} />
      <ContactSewist
        sewistName={name}
        mobileNumber={mobileNumber}
        email={user.email}
        location={location}
      />
    </div>
  );
}
