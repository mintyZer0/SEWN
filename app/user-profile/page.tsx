"use client";

import React, { useState, useEffect } from "react";
import { User, Bell, ShoppingBag, Ruler, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

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
            .from("profiles")
            .select("*")
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

    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [firstName, ...lastNameParts] = formData.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: formData.phone,
          // Need to update database
          // gender: formData.gender,
          // dob: formData.dob,
        })
        .eq("id", user.id);

      if (error) throw error;

      setIsEditing(false);
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sidebarItems = [
    {
      title: "My Account",
      icon: <User className="w-5 h-5" />,
      subItems: ["Profile", "Banks and Card", "Addresses"],
      active: true,
    },
    {
      title: "Notification",
      icon: <Bell className="w-5 h-5" />,
      subItems: ["Order Update", "Promotions"],
    },
    { title: "Orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { title: "Measurements", icon: <Ruler className="w-5 h-5" /> },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-700">
      {/* Sidebar */}
      <aside className="w-64 p-8 border-r border-gray-100">
        <nav className="space-y-8">
          {sidebarItems.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-3 text-[#E87B35] font-semibold">
                {item.icon}
                <span className="text-lg">{item.title}</span>
              </div>
              {item.subItems && (
                <ul className="ml-8 space-y-2 border-l-2 border-[#E87B35] pl-4">
                  {item.subItems.map((sub, sIdx) => (
                    <li key={sIdx}>
                      <Link
                        href="#"
                        className={`text-sm block transition-all ${
                          sub === "Profile"
                            ? "text-white bg-[#E87B35] px-2 py-1 rounded w-fit"
                            : "text-gray-500 hover:text-[#E87B35]"
                        }`}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12">
        <div className="bg-[#8A6FB1] rounded-[40px] p-8 md:p-12 min-h-[600px] relative shadow-2xl">
          <header className="mb-10">
            <h1 className="text-5xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/80 text-xl font-medium">
              Manage and protect your account
            </p>
          </header>

          {/* Inner White Display Card */}
          <div className="bg-white rounded-[30px] p-10 flex flex-col lg:flex-row gap-16 shadow-lg border border-white/20">
            {/* Form Fields Section */}
            <div className="flex-1 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-[#E87B35] text-2xl font-bold tracking-tight">
                  Display Card
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#E87B35] hover:underline font-semibold"
                  >
                    Edit Profile
                  </button>
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
                  className={`w-full border border-[#E87B35]/30 rounded-xl px-4 py-2.5 text-[#E87B35] focus:outline-none focus:ring-2 focus:ring-[#E87B35]/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
                />

                <label className="text-xl font-medium text-gray-800">
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full border border-[#E87B35]/30 rounded-xl px-4 py-2.5 text-[#E87B35] focus:outline-none focus:ring-2 focus:ring-[#E87B35]/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
                />

                <label className="text-xl font-medium text-gray-800">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 bg-gray-100 cursor-not-allowed"
                />

                <label className="text-xl font-medium text-gray-800">
                  Phone:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full border border-[#E87B35]/30 rounded-xl px-4 py-2.5 text-[#E87B35] focus:outline-none focus:ring-2 focus:ring-[#E87B35]/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
                />

                <label className="text-xl font-medium text-gray-800">
                  Gender:
                </label>
                <div className="flex gap-8 text-[#E87B35]">
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
                        className="w-5 h-5 accent-[#E87B35]"
                      />
                      <span
                        className={`text-lg ${isEditing ? "group-hover:text-[#FF8C42]" : ""} transition-colors`}
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
                  className={`w-full border border-[#E87B35]/30 rounded-xl px-4 py-2.5 text-[#E87B35] focus:outline-none focus:ring-2 focus:ring-[#E87B35]/20 transition-all ${!isEditing ? "bg-gray-100/50 cursor-default" : "bg-gray-50/30"}`}
                />

                <label className="text-xl font-medium text-gray-800">
                  Addresses:
                </label>
                <button
                  disabled={!isEditing}
                  className={`bg-[#FF8C42] text-white px-8 py-2.5 rounded-xl font-bold w-fit transition-all transform ${isEditing ? "hover:bg-[#e67e3a] hover:scale-105 active:scale-95 shadow-md" : "opacity-50 cursor-not-allowed"}`}
                >
                  Change Address
                </button>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-gray-200 self-stretch"></div>

            {/* Profile Image Section */}
            <div className="flex flex-col items-center justify-center gap-8 lg:px-12">
              <div className="w-56 h-56 bg-[#5A5A5A] rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-100 shadow-inner">
                <User className="w-32 h-32 text-gray-400" />
              </div>
              <button
                disabled={!isEditing}
                className={`border-2 border-gray-300 text-gray-600 px-8 py-2 rounded-full transition-all font-medium text-lg ${isEditing ? "hover:bg-gray-50 hover:border-gray-400 shadow-sm" : "opacity-50 cursor-not-allowed"}`}
              >
                Select Image
              </button>
            </div>
          </div>

          {/* Confirm Changes / Edit Button */}
          <div className="flex justify-end mt-12 pr-4">
            <button
              onClick={handleConfirmChanges}
              disabled={isSaving}
              className="bg-white text-[#E87B35] px-12 py-3.5 rounded-[20px] font-black text-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all active:translate-y-0 flex items-center gap-3 disabled:opacity-70"
            >
              {isSaving && <Loader2 className="w-6 h-6 animate-spin" />}
              {isEditing ? "Confirm Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
