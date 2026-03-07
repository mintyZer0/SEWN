"use client";

import React, { useState } from "react";
import ProfileSection from "@/components/user-profile/profile-section";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import MeasurementCard, { MeasurementData } from "@/components/user-profile/measurement-card";
import { EditMeasurementsModal } from "@/components/modals/edit-measurements-modal";

interface MeasurementProfile {
  id: number;
  title: string;
  data: MeasurementData;
}

const INITIAL_MEASUREMENTS: MeasurementProfile[] = [
  {
    id: 1,
    title: "Profile #1",
    data: {
      "Chest": "40 in",
      "Shoulder Width": "18 in",
      "Neck": "16 in",
      "Sleeve Length (Short)": "8 in",
      "Sleeve Length (Long)": "24 in",
      "Upper Arm (Bicep)": "14 in",
      "Wrist": "8 in",
      "Shirt Length": "27-28 in",
      "Waist (Shirt Slim Fit)": "34 in",
      "Waist (Pants)": "32 in",
      "Hips": "38 in",
      "Inseam": "30 in",
      "Outseam": "40 in",
      "Thigh": "22 in",
      "Knee": "16 in",
      "Leg Opening": "14 in",
      "Front Rise": "10.5 in",
      "Back Rise": "14 in",
    },
  },
];

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<MeasurementProfile[]>(INITIAL_MEASUREMENTS);
  const [editingProfile, setEditingProfile] = useState<MeasurementProfile | null>(null);

  const handleEdit = (id: number) => {
    const profile = measurements.find(m => m.id === id);
    if (profile) {
      setEditingProfile(profile);
    }
  };

  const handleConfirmEdit = (newData: MeasurementData) => {
    if (editingProfile) {
      setMeasurements(prev => prev.map(m => 
        m.id === editingProfile.id ? { ...m, data: newData } : m
      ));
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      setMeasurements(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleAddMeasures = () => {
    const newId = Math.max(0, ...measurements.map(m => m.id)) + 1;
    const newProfile: MeasurementProfile = {
      id: newId,
      title: `Profile #${newId}`,
      data: {
        "Chest": "0 in",
        "Shoulder Width": "0 in",
        "Neck": "0 in",
      }
    };
    setMeasurements(prev => [...prev, newProfile]);
  };

  return (
    <ProfileSection
      title="Measurement Profile"
      description="Manage your Measurements"
      headerAction={
        <ProfileButton
          variant="white"
          size="xl"
          className="px-10"
          onClick={handleAddMeasures}
        >
          Add Measures
        </ProfileButton>
      }
    >
      <div className="space-y-8 mt-2">
        {measurements.length > 0 ? (
          measurements.map((profile) => (
            <MeasurementCard
              key={profile.id}
              title={profile.title}
              data={profile.data}
              onEdit={() => handleEdit(profile.id)}
              onDelete={() => handleDelete(profile.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-lg min-h-[220px] flex items-center justify-center border border-white/20">
            <p className="text-gray-800 text-xl md:text-2xl font-medium">
              Add a measurement
            </p>
          </div>
        )}
      </div>

      {editingProfile && (
        <EditMeasurementsModal
          isOpen={!!editingProfile}
          title={editingProfile.title}
          data={editingProfile.data}
          onClose={() => setEditingProfile(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </ProfileSection>
  );
}
