"use client";

import React, { useState, useEffect } from "react";
import ProfileSection from "@/components/user-profile/profile-section";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import MeasurementCard from "@/components/user-profile/measurement-card";
import { EditMeasurementsModal } from "@/components/modals/edit-measurements-modal";
import { 
  getMeasurements, 
  createMeasurement, 
  updateMeasurement, 
  deleteMeasurement, 
  MeasurementProfile,
  MeasurementData
} from "@/lib/measurements";

export default function MeasurementsPage() {
  const [measurements, setMeasurements] = useState<MeasurementProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<MeasurementProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    const { data, error } = await getMeasurements();
    if (error) {
      console.error("Error fetching measurements:", error);
    } else if (data) {
      setMeasurements(data);
    }
    setLoading(false);
  };

  const handleEdit = (profile: MeasurementProfile) => {
    setEditingProfile(profile);
  };

  const handleConfirmEdit = async (newData: Partial<MeasurementData>) => {
    if (editingProfile) {
      const { data, error } = await updateMeasurement(editingProfile.id, newData);
      if (error) {
        alert("Failed to update measurement: " + error.message);
      } else if (data) {
        setMeasurements(prev => prev.map(m => m.id === data.id ? data : m));
        setEditingProfile(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      const { error } = await deleteMeasurement(id);
      if (error) {
        alert("Failed to delete measurement: " + error.message);
      } else {
        setMeasurements(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  const handleAddMeasures = async () => {
    const nextNum = measurements.length + 1;
    const profileName = `Profile #${nextNum}`;
    
    // Create with some default empty values
    const { data, error } = await createMeasurement(profileName, {
      chest: null,
      shoulder_width: null,
      neck: null
    });

    if (error) {
      const errorMsg = typeof error === "string" ? error : error.message;
      alert("Failed to create profile: " + errorMsg);
    } else if (data) {
      setMeasurements(prev => [...prev, data]);
      setEditingProfile(data); // Open modal for the new profile
    }
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
          Add Measurements
        </ProfileButton>
      }
    >
      <div className="space-y-8 mt-2">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : measurements.length > 0 ? (
          measurements.map((profile) => (
            <MeasurementCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEdit(profile)}
              onDelete={() => handleDelete(profile.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-lg min-h-[220px] flex items-center justify-center border border-white/20">
            <p className="text-gray-800 text-xl md:text-2xl font-medium">
              No measurement profiles found. Click "Add Measures" to create one.
            </p>
          </div>
        )}
      </div>

      {editingProfile && (
        <EditMeasurementsModal
          isOpen={!!editingProfile}
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </ProfileSection>
  );
}
