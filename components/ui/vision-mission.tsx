export default function VisionMission() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 p-4 sm:p-8 lg:p-25 place-items-center">
        <div className="flex flex-col text-5xl lg:text-7xl text-center p-4 py-6 gap-4 w-full lg:w-140">
          <h2 className="text-primary">vision</h2>
          <p className="text-xl sm:text-2xl lg:text-3xl">
            To be the leading advocacy outlet that sustains Philippine
            Handicraft Traditions.
          </p>
        </div>
        <div className="flex flex-col text-5xl lg:text-7xl text-center p-4 py-6 gap-4 w-full lg:w-140">
          <h2 className="text-primary">mission</h2>
          <p className="text-xl sm:text-2xl lg:text-3xl">
            To uplift the lives of homemaker-artisans by bridging livelihood and
            technology.
          </p>
        </div>
        <div className="flex flex-col text-5xl lg:text-7xl text-center p-4 py-6 gap-4 w-full lg:w-140 lg:col-span-2">
          <h2 className="text-primary">core values</h2>
          <p className="text-xl sm:text-2xl lg:text-3xl">
            Curiosity. Vision. Collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}
