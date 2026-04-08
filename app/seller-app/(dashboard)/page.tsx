"use client";

import dynamic from "next/dynamic";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { LocationPicker } from "@/components/ui/location-picker";

// Dynamically import map components to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/ui/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg" />
  ),
});

const MapSearchBox = dynamic(() => import("@/components/ui/map-search-box"), {
  ssr: false,
});

export default function SewerCenterPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [position, setPosition] = useState({ lat: 15.48, lng: 120.59 });
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dbLocationDisplay, setDbLocationDisplay] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    social_link: "",
    phone: "",
    achievement_1: "",
    achievement_2: "",
    achievement_3: "",
  });

  const [services, setServices] = useState({
    alterations: false,
    repair: false,
    commissions: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('users')
        .select(`
          first_name,
          last_name,
          email,
          user_phones(phone),
          user_addresses(id, full_address, latitude, longitude, is_primary, address_type, province, city, barangay, zip_code),
          user_socials(handle),
          sewer_achievements(title),
          sewer_settings(accepting_alterations, accepting_repairs, accepting_commissions)
        `)
        .eq('id', user.id)
        .single();

      if (profileData) {
        const addresses = Array.isArray(profileData.user_addresses) ? profileData.user_addresses : [profileData.user_addresses].filter(Boolean);
        const shopAddress = addresses.find((a: any) => a?.address_type === 'shop' && a?.is_primary) 
            || addresses.find((a: any) => a?.address_type === 'shop') 
            || addresses[0];
        
        const phones = Array.isArray(profileData.user_phones) ? profileData.user_phones : [profileData.user_phones].filter(Boolean);
        const phone = phones[0]?.phone;

        const socials = Array.isArray(profileData.user_socials) ? profileData.user_socials : [profileData.user_socials].filter(Boolean);
        const social = socials[0];

        const achievements = Array.isArray(profileData.sewer_achievements) ? profileData.sewer_achievements : [profileData.sewer_achievements].filter(Boolean);

        const settingsArray = Array.isArray(profileData.sewer_settings) ? profileData.sewer_settings : [profileData.sewer_settings].filter(Boolean);
        const settings = settingsArray[0];

        setFormData({
          name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
          description: "", // Shop description is not yet linked to a DB field
          email: profileData.email || "",
          social_link: social?.handle || "",
          phone: phone || "",
          achievement_1: achievements[0]?.title || "",
          achievement_2: achievements[1]?.title || "",
          achievement_3: achievements[2]?.title || "",
        });

        if (shopAddress) {
            setAddress(shopAddress.full_address || "");
            setZipCode(shopAddress.zip_code?.toString() || "");
            
            // Format existing location for display when not editing
            const locParts = [shopAddress.province, shopAddress.city, shopAddress.barangay].filter(Boolean);
            setDbLocationDisplay(locParts.join(", ") || "No location set");

            if (shopAddress.latitude && shopAddress.longitude) {
                setPosition({ lat: shopAddress.latitude, lng: shopAddress.longitude });
            }
        }

        if (settings) {
            setServices({
                alterations: settings.accepting_alterations || false,
                repair: settings.accepting_repairs || false,
                commissions: settings.accepting_commissions || false,
            });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServices(prev => ({ ...prev, [e.target.value]: e.target.checked }));
  };

  const handlePlaceSelected = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.geometry?.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setPosition(newPos);
        setAddress(place.formatted_address || "");
      }
    },
    [],
  );

  const handlePositionChange = useCallback((newPos: { lat: number; lng: number }) => {
    setPosition(newPos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
        setIsSaving(true);
        const nameParts = formData.name.trim().split(" ");
        const first_name = nameParts[0] || "";
        const last_name = nameParts.slice(1).join(" ");

        await supabase.from('users').update({ first_name, last_name }).eq('id', user.id);
        
        if (formData.phone) {
            await supabase.from('user_phones').upsert({ user_id: user.id, phone: formData.phone }, { onConflict: 'user_id' });
        }

        if (formData.social_link) {
            await supabase.from('user_socials').upsert({ 
                user_id: user.id, 
                platform: 'Other', 
                handle: formData.social_link 
            }, { onConflict: 'user_id, platform' });
        }

        // Achievements (Simple replacement logic)
        const achievements = [formData.achievement_1, formData.achievement_2, formData.achievement_3].filter(Boolean);
        if (achievements.length > 0) {
            await supabase.from('sewer_achievements').delete().eq('user_id', user.id);
            await supabase.from('sewer_achievements').insert(
                achievements.map(title => ({ user_id: user.id, title }))
            );
        }

        const { data: shopAddr } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .eq('address_type', 'shop')
            .maybeSingle();

        let finalCity = "";
        let finalProvince = "";
        let finalBarangay = "";

        if (location) {
            const parts = location.split(" / ").map(s => s.trim());
            const [region, province, city, barangay] = parts;
            finalProvince = province || region || "";
            finalCity = city || "";
            finalBarangay = barangay || "";
        }

        const addressData: any = {
            full_address: address,
            latitude: position.lat,
            longitude: position.lng,
            zip_code: parseInt(zipCode) || 0
        };

        if (location) {
            addressData.province = finalProvince;
            addressData.city = finalCity;
            addressData.barangay = finalBarangay;
        }

        if (shopAddr) {
            await supabase.from('user_addresses').update(addressData).eq('id', shopAddr.id);
        } else {
            await supabase.from('user_addresses').insert({
                user_id: user.id,
                ...addressData,
                address_type: 'shop',
                is_primary: true,
                city: addressData.city || "",
                barangay: addressData.barangay || "",
                province: addressData.province || "",
            });
        }

        await supabase.from('sewer_settings').upsert({
            user_id: user.id,
            accepting_alterations: services.alterations,
            accepting_repairs: services.repair,
            accepting_commissions: services.commissions
        }, { onConflict: 'user_id' });

        setIsEditing(false);
    } catch (error: any) {
        console.error("Error updating profile:", error);
    } finally {
        setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-primary text-xl">Loading profile...</div>;
  }

  return (
    <div className="p-12">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Profile</h2>
          {!isEditing && (
            <ProfileButton type="button" variant="ghost" onClick={() => setIsEditing(true)}>
              Edit Profile
            </ProfileButton>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-primary text-xl font-medium mb-2">
                Sewer Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                placeholder="Renerie"
                className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-primary text-xl font-medium mb-2">
                Profile Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing || isSaving}
                rows={4}
                placeholder="Talented and hardworking sewer, dedicated to crafting you the best of the best sews ever"
                className="w-full p-4 rounded-3xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none resize-none disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="ren@gmail.com"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || isSaving}
                  placeholder="091961494946"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Address
                </label>
                {isEditing ? (
                  <LocationPicker
                    name="location"
                    onChange={setLocation}
                    placeholder="Select Region / Province / City / Barangay"
                    triggerClassName="h-auto p-4 rounded-2xl border-none shadow-sm text-lg"
                  />
                ) : (
                  <input
                    type="text"
                    value={dbLocationDisplay}
                    disabled
                    className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                )}
              </div>
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  disabled={!isEditing || isSaving}
                  placeholder="2300"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-primary text-xl font-medium mb-2">
                Detailed Address
              </label>
              <textarea
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing || isSaving}
                rows={2}
                placeholder="Street Address, Building, House No."
                className="w-full p-4 rounded-3xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none resize-none disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Social Media Link
                </label>
                <input
                  type="text"
                  name="social_link"
                  value={formData.social_link}
                  onChange={handleChange}
                  disabled={!isEditing || isSaving}
                  placeholder="https://fb.ren.com"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-primary text-xl font-medium mb-4">
                Achievements
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary font-medium">1.</span>
                  <input
                    type="text"
                    name="achievement_1"
                    value={formData.achievement_1}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    placeholder="Best sewer"
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary font-medium">2.</span>
                  <input
                    type="text"
                    name="achievement_2"
                    value={formData.achievement_2}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary font-medium">3.</span>
                  <input
                    type="text"
                    name="achievement_3"
                    value={formData.achievement_3}
                    onChange={handleChange}
                    disabled={!isEditing || isSaving}
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Image */}
          <div className="flex flex-col items-center pt-8">
            <div className="w-64 h-64 rounded-full bg-gray-500 flex items-center justify-center relative overflow-hidden group cursor-pointer border-4 border-white shadow-xl">
              <span className="text-white font-medium text-lg">
                Select Image
              </span>
              <input
                type="file"
                name="profile_image"
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Image upload coming soon</p>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-medium text-primary mb-6 flex items-center gap-8">
            Services Offered:
            <div className="flex items-center gap-12 font-normal text-xl text-primary">
              <CustomCheckbox
                label="Alterations"
                name="services"
                value="alterations"
                checked={services.alterations}
                onChange={handleServiceChange}
                disabled={!isEditing || isSaving}
                size="md"
              />
              <CustomCheckbox
                label="Repair"
                name="services"
                value="repair"
                checked={services.repair}
                onChange={handleServiceChange}
                disabled={!isEditing || isSaving}
                size="md"
              />
              <CustomCheckbox
                label="Commissions"
                name="services"
                value="commissions"
                checked={services.commissions}
                onChange={handleServiceChange}
                disabled={!isEditing || isSaving}
                size="md"
              />
            </div>
          </h3>
        </div>

        {/* Map Section */}
        <div className="mt-12 text-center">
          <h3 className="text-3xl font-bold text-primary mb-6">
            Pin your workplace
          </h3>
          <div className="max-w-[80%] mx-auto space-y-4">
            {isEditing && (
              <MapSearchBox 
                onPlaceSelected={handlePlaceSelected} 
                className="mb-4"
                placeholder="Search for your workplace address..."
              />
            )}
            <MapComponent
              position={position}
              height={600}
              width="100%"
              className="shadow-lg"
              draggable={isEditing && !isSaving}
              onPositionChange={handlePositionChange}
            />
            <input type="hidden" name="latitude" value={position.lat} />
            <input type="hidden" name="longitude" value={position.lng} />
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="mt-16 flex justify-end gap-6 pb-20">
            <ProfileButton type="button" variant="white" size="xl" onClick={() => window.location.reload()} disabled={isSaving}>
              Discard
            </ProfileButton>
            <ProfileButton type="submit" variant="orange" size="xl" disabled={isSaving} className="flex items-center justify-center gap-2">
              {isSaving && <Loader2 className="w-6 h-6 animate-spin" />}
              Confirm Changes
            </ProfileButton>
          </div>
        )}
      </form>
    </div>
  );
}
