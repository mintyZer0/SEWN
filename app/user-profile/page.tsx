"use client";

import React, { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import ProfileSection from "@/components/user-profile/profile-section";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

export default function UserProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("users")
            .select(
              `*,
              user_phones(
              phone
              )
              `,
            )
            .eq("id", user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error.message);
          } else if (data) {
            setFormData({
              username: data.first_name || "",
              name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
              email: data.email || user.email || "",
              phone: data.phone_number || "",
              gender: data.gender || "male",
              dob: data.dob || "2004-10-06",
            });
          }
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmChanges = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    {/*Save to database*/}
    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [firstName, ...lastNameParts] = formData.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const { error: userError } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          gender: formData.gender,
          birthday: formData.dob,
        })
        .eq("id", user.id);

      const { error: phoneError } = await supabase
        .from("user_phones")
        .upsert({
          user_id: user.id,
          phone: formData.phone,
        })
        .eq("id", user.id);

      if (userError || phoneError) {
        throw new Error(
          userError?.message || phoneError?.message || "Unknown error",
        );
      }

      setIsEditing(false);
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <ProfileSection
      title="My Profile"
      description="Manage and protect your account"
    >
      <div className="bg-white rounded-[30px] p-10 flex flex-col lg:flex-row gap-16 shadow-lg border border-white/20">
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-third text-2xl font-bold tracking-tight">
              Display Card
            </h2>
            {!isEditing && (
              <ProfileButton variant="ghost" onClick={() => setIsEditing(true)}>
                Edit Profile
              </ProfileButton>
            )}
          </div>

          <div className="grid grid-cols-[140px_1fr] items-center gap-y-6 gap-x-4">
            <label className="text-xl font-medium text-gray-800">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
            />

            <label className="text-xl font-medium text-gray-800">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
            />

            <label className="text-xl font-medium text-gray-800">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 bg-gray-100 cursor-not-allowed"
            />

            <label className="text-xl font-medium text-gray-800">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
            />

            <label className="text-xl font-medium text-gray-800">Gender:</label>
            <div className="flex gap-8 text-third">
              {["Male", "Female", "Other"].map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2.5 ${isEditing ? "cursor-pointer group" : "cursor-default"}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.toLowerCase()}
                    checked={formData.gender === option.toLowerCase()}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-5 h-5 accent-third"
                  />
                  <span
                    className={`text-lg ${isEditing ? "group-hover:text-third/80" : ""} transition-colors`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>

            <label className="text-xl font-medium text-gray-800">
              Date of birth:
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border border-third/30 rounded-xl px-4 py-2.5 text-third focus:outline-none focus:ring-2 focus:ring-third/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
            />

            <label className="text-xl font-medium text-gray-800">
              Addresses:
            </label>
            <ProfileButton
              variant="orange"
              size="md"
              disabled={!isEditing}
              className={cn(
                "max-w-60",
                !isEditing && "opacity-50 cursor-not-allowed",
              )}
            >
              Change Address
            </ProfileButton>
          </div>
        </div>

        <div className="hidden lg:block w-px bg-gray-200 self-stretch"></div>

        <div className="flex flex-col items-center justify-center gap-8 lg:px-12">
          <div className="w-56 h-56 bg-[#5A5A5A] rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100 shadow-inner">
            <User className="w-32 h-32 text-gray-400" />
          </div>
          <ProfileButton
            variant="ghost"
            disabled={!isEditing}
            className={cn(
              "border-2 border-gray-300 text-gray-600 px-8 py-2 rounded-full hover:bg-gray-50 hover:border-gray-400 shadow-sm",
              !isEditing && "opacity-50 cursor-not-allowed",
            )}
          >
            Select Image
          </ProfileButton>
        </div>
      </div>

      <div className="flex justify-end mt-6 pr-4">
        <ProfileButton
          variant="white"
          size="xl"
          onClick={handleConfirmChanges}
          disabled={isSaving}
          className="flex items-center gap-3"
        >
          {isSaving && <Loader2 className="w-6 h-6 animate-spin" />}
          {isEditing ? "Confirm Changes" : "Edit Profile"}
        </ProfileButton>
      </div>
    </ProfileSection>
  );
}
