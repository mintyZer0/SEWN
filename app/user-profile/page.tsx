"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getS3PublicUrl } from "@/lib/s3-client";
import { cn } from "@/lib/utils";
import ProfileSection from "@/components/user-profile/profile-section";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function UserProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use a dedicated folder for avatars in the existing bucket
  const { images, uploading, addImages, uploadImages, clearAll } = useImageUpload({
    bucket: 'product-images',
    folder: 'avatars'
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];

  const allowedTypes = ["image/jpeg", "image/png"];

  const maxSize = 10 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG and PNG files are allowed.");
    return;
  }

  if (file.size > maxSize) {
    alert("File size must be less than 10MB.");
    return;
  }

  clearAll();
  addImages(files).then((newImages) => uploadImages(newImages));
  };

  const [uploadReady, setUploadReady] = useState(true);

  useEffect(() => {
    const hasPending = images.some(img => img.status === "pending");
    const uploadReady = !hasPending || images.length === 0;
    setUploadReady(uploadReady);
  }, [images]);

  // Keep track of the current avatar record to handle deletion of old files
  const [currentAvatarRecord, setCurrentAvatarRecord] = useState<{id?: string, avatar_url: string} | null>(null);
  
  const [formData, setFormData] = useState({
      username: "",
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      avatar_url: "",
    });


  useEffect(() => {async function getProfile() {
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
              user_phones(phone),
              user_avatars(id,avatar_url)`)
            .eq("id", user.id)
            .single();

          if (error) {
          } else if (data) {
            const avatar = data.user_avatars;

            let publicAvatarUrl = "";

            if (avatar?.avatar_url) {
              publicAvatarUrl = getS3PublicUrl(avatar.avatar_url);
            } else {
              publicAvatarUrl = getS3PublicUrl("avatars/default.jpg");
            }
            console.log("FETCHED DATA:", data.user_avatars);
            setAvatarUrl(publicAvatarUrl);

            setFormData({
              username: data.first_name || "",
              name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
              email: data.email || user.email || "",
              phone: data.user_phones.phone || "",
              gender: data.gender || "male",
              dob: data.birthday || "1999-01-01",
              avatar_url: publicAvatarUrl,
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

    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [firstName, ...lastNameParts] = formData.name.split(" ");
      const lastName = lastNameParts.join(" ");

      // Update User Basic Info
      const { error: userError } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          gender: formData.gender,
          birthday: formData.dob,
        })
        .eq("id", user.id);

      // Update Phone
      const { error: phoneError } = await supabase
        .from("user_phones")
        .upsert({
          user_id: user.id,
          phone: formData.phone,
        }, { onConflict: 'user_id' });

      // Handle Avatar Update
      const completedUpload = images.find(img => img.status === 'complete');
      
      if (completedUpload?.filePath) {
        const filePath = completedUpload?.filePath;

        if (!filePath?.startsWith("avatars/")) {
          throw new Error("Invalid file path: " + filePath);
        }
      }
      const { data: existingAvatar } = await supabase
        .from("user_avatars")
        .select("avatar_url")
        .eq("user_id", user.id)
        .single();

        if (existingAvatar?.avatar_url && existingAvatar.avatar_url !== "avatars/default.jpg") {
          await fetch('/api/s3-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: existingAvatar.avatar_url, action: 'delete' })
          });
        }

      if (completedUpload?.filePath && !completedUpload.filePath.endsWith("/")) {
        // Delete old image from storage if it exists
        if (currentAvatarRecord?.avatar_url) {
          await fetch('/api/s3-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: currentAvatarRecord.avatar_url, action: 'delete' })
          });
        }

        // Update database with new URL
        const { data: newAvatar, error: avatarError } = await supabase
          .from("user_avatars")
          .upsert({
            user_id: user.id,
            avatar_url: completedUpload.filePath,
            uploaded_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
          .select()
          .single();


        if (avatarError) throw avatarError;
        
        if (newAvatar) {
          setCurrentAvatarRecord(newAvatar);

          // Convert file path to public URL
          const newPublicUrl = getS3PublicUrl(newAvatar.avatar_url);

          setAvatarUrl(newPublicUrl);
          setFormData(prev => ({
            ...prev,
            avatar_url: newPublicUrl
          }));
        }

      }

      if (userError || phoneError) {
        throw new Error(
          userError?.message || phoneError?.message || "Unknown error",
        );
      }

      setIsEditing(false);
      clearAll();
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

  const currentPreview = images[images.length - 1]?.preview || avatarUrl;

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
          <div className="w-56 h-56 bg-[#5A5A5A] rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100 shadow-inner relative">
            {currentPreview ? (
            <>
            <img
                src={currentPreview}
                alt="Profile"
                className="w-full h-full object-cover"

              />
            </>
            ) : null}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="profile_image"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <ProfileButton
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isEditing}
            className={cn(
              "border-2 border-gray-300 text-gray-600 px-8 py-2 rounded-full hover:bg-gray-50 hover:border-gray-400 shadow-sm",
              (!isEditing || uploading) && "opacity-50 cursor-not-allowed",
            )}
          
          >
            {uploading ? "Uploading..." : "Select Image"}

          </ProfileButton>
        </div>
      </div>

      <div className="flex justify-end mt-6 pr-4">
        <ProfileButton
          variant="white"
          size="xl"
          onClick={handleConfirmChanges}
          disabled={isSaving || !uploadReady}
          className="flex items-center gap-3"
        >
          {isSaving && <Loader2 className="w-6 h-6 animate-spin" />}
          {isEditing ? "Confirm Changes" : "Edit Profile"}
        </ProfileButton>
      </div>
    </ProfileSection>
  );
}
