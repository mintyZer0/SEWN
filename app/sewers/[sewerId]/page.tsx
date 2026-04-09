import { notFound } from "next/navigation";
import SewerHeader from "@/components/sewer-profile/sewer-header";
import Services from "@/components/sewer-profile/services";
import Stats from "@/components/sewer-profile/stats";
import Products from "@/components/sewer-profile/products";
import AchievementsServices from "@/components/sewer-profile/achievements-services";
import SeparatorX from "@/components/ui/separator-x";
import Map from "@/components/sewer-profile/map";
import ContactSewer from "@/components/sewer-profile/contact-sewer";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: Promise<{
    sewerId: string;
  }>;
}

export default async function SewerPage({ params }: PageProps) {
  const { sewerId } = await params;
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
      user_addresses (province, city, is_primary),
      user_phones (phone),
      sewer_achievements (title),
      sewer_statistics (rating_avg, profile_views_total, total_orders_completed),
      sewer_verifications (verification_status),
      sewer_settings (accepting_alterations, accepting_repairs, accepting_commissions)
    `)
    .eq("id", sewerId)
    .single();

  if (error || !user || user.user_type !== "seller") {
    return notFound();
  }

  // Increment profile views in the background (Optional: track if requester is not the owner)
  try {
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData?.user;
    if (!authUser || authUser.id !== sewerId) {
      await supabase.rpc('increment_profile_views', { target_user_id: sewerId });
    }
  } catch (err) {
    console.error("View Tracking Error:", err);
  }

  const primaryAddress =
    user.user_addresses?.find((addr: any) => addr.is_primary) ||
    user.user_addresses?.[0];

  const location =
    primaryAddress
      ? `${primaryAddress.city}${primaryAddress.province ? `, ${primaryAddress.province}` : ""}`
      : "Location not set";

  const avatar = user.user_avatars?.[0]?.avatar_url || "/assets/sewer-photos/1.jpg";
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous Sewer";

  // New logic for dynamic fields
  const stats = user.sewer_statistics?.[0];
  const verification = user.sewer_verifications?.[0];
  const bio = "This is a placeholder bio. Additional profile fields coming soon.";
  const rating = stats?.rating_avg || 0;
  const yearsOfExperience = 0; // Still mocked until 'started_sewing_at' is implemented
  const productsSewed = stats?.total_orders_completed || 0;
  
  const achievements = user.sewer_achievements?.map((a: any) => a.title) || [];
  const tesdaCertified = achievements.some(a => a.toLowerCase().includes("tesda"));

  const settingsArray = Array.isArray(user.sewer_settings) ? user.sewer_settings : [user.sewer_settings].filter(Boolean);
  const settings = settingsArray[0];
  const servicesOffered: ("repair" | "alteration" | "commission")[] = [];
  if (settings?.accepting_repairs) servicesOffered.push("repair");
  if (settings?.accepting_alterations) servicesOffered.push("alteration");
  if (settings?.accepting_commissions) servicesOffered.push("commission");

  const mobileNumber = user.user_phones?.[0]?.phone || "Phone not listed";

  return (
    <div className="py-12">
      <SewerHeader
        name={name}
        image={avatar}
        bio={bio}
        rating={rating}
        location={location}
        isVerified={verification?.verification_status === "verified"}
        isTesdaCertified={tesdaCertified}
      />
      <Services sewerId={sewerId} servicesOffered={servicesOffered} />
      <Stats
        yearsOfExperience={yearsOfExperience}
        rating={rating}
        productsSewed={productsSewed}
      />
      <Products sewerId={sewerId} />
      <SeparatorX />
      <AchievementsServices
        achievements={achievements}
        tesdaCertified={tesdaCertified}
        servicesOffered={servicesOffered as any}
      />
      <Map />
      <ContactSewer
        sewerName={name}
        mobileNumber={mobileNumber}
        email={user.email}
        location={location}
      />
    </div>
  );
}
