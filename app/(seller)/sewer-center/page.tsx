"use client";

import dynamic from "next/dynamic";

// Dynamically import map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/ui/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-lg" />
  ),
});

export default function SewerCenterPage() {
  return (
    <div className="p-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 ">Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Column: Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="block text-primary text-xl font-medium mb-2">
                Sewer Name
              </label>
              <input
                type="text"
                placeholder="Renerie"
                className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
              />
            </div>

            <div>
              <label className="block text-primary text-xl font-medium mb-2">
                Profile Description
              </label>
              <textarea
                rows={4}
                placeholder="Talented and hardworking sewer, dedicated to crafting you the best of the best sews ever"
                className="w-full p-4 rounded-3xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ren@gmail.com"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
                />
              </div>
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Company Address
                </label>
                <input
                  type="text"
                  placeholder="Ren Avenue, Manila"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Social Media Link
                </label>
                <input
                  type="text"
                  placeholder="https://fb.ren.com"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
                />
              </div>
              <div>
                <label className="block text-primary text-xl font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="091961494946"
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
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
                    placeholder="Best sewer"
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary font-medium">2.</span>
                  <input
                    type="text"
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl text-primary font-medium">3.</span>
                  <input
                    type="text"
                    className="flex-1 p-4 rounded-2xl border-none bg-white shadow-sm text-lg focus:ring-2 focus:ring-third outline-none"
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
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Services Offered Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-medium text-primary mb-6 flex items-center gap-8">
            Services Offered:
            <div className="flex items-center gap-12 font-normal text-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-8 h-8 rounded border-none bg-secondary shadow-sm checked:bg-third focus:ring-third"
                />
                <span>Alterations</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-8 h-8 rounded border-none bg-secondary shadow-sm checked:bg-third focus:ring-third"
                />
                <span>Repair</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-8 h-8 rounded border-none bg-secondary shadow-sm checked:bg-third focus:ring-third"
                />
                <span>Commissions</span>
              </label>
            </div>
          </h3>
        </div>

        {/* Map Section */}
        <div className="mt-12 text-center">
          <h3 className="text-3xl font-bold text-primary mb-6">
            Pin your workplace
          </h3>
          <MapComponent
            position={[15.48, 120.59]}
            height={600}
            width="80%"
            className="mx-auto shadow-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex justify-end gap-6 pb-20">
          <button className="px-12 py-3 rounded-full bg-red-500 text-white text-xl font-bold hover:bg-red-600 transition-colors shadow-lg">
            Discard
          </button>
          <button className="px-12 py-3 rounded-full bg-third text-white text-xl font-bold hover:bg-third/90 transition-colors shadow-lg">
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
}
