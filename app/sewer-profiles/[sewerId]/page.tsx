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
      user_addresses (province, city, is_primary)
    `)
    .eq("id", sewerId)
    .single();

  if (error || !user || user.user_type !== "seller") {
    return notFound();
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

  // Dummy data for missing schema fields
  const bio = "This is a placeholder bio. Additional profile fields coming soon.";
  const rating = 5.0;
  const yearsOfExperience = 0;
  const productsSewed = 0;
  const achievements: string[] = [];
  const tesdaCertified = false;
  const servicesOffered: string[] = [];
  const mobileNumber = "+63 000 000 0000";

  return (
    <div className="py-12">
      <SewerHeader
        name={name}
        image={avatar}
        bio={bio}
        rating={rating}
        location={location}
      />
      <Services sewerId={sewerId} />
      <Stats
        yearsOfExperience={yearsOfExperience}
        rating={rating}
        productsSewed={productsSewed}
      />
      <Products />
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
