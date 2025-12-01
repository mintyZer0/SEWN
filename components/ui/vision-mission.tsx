export default function VisionMission() {
  return (
    <div className="h-150">
      <div className="grid grid-cols-2 grid-rows-2 gap-20 p-25 place-items-center">
        <div className="flex flex-col text-8xl text-center p-4 py-6 gap-4 h-40 w-140">
          <h2 className="text-primary">vision</h2>
          <p className=" text-3xl">
            To be the leading advocacy outlet that sustains Philippine
            Handicraft Traditions.
          </p>
        </div>
        <div className="flex flex-col text-8xl text-center p-4 py-6 gap-4 h-40 w-140">
          <h2 className="text-primary">mission</h2>
          <p className=" text-3xl">
            To uplift the lives of homemaker-artisans by bridging livelihood and
            technology.
          </p>
        </div>
        <div className="flex flex-col text-8xl text-center p-4 py-6 gap-4 h-40 w-140 col-span-2">
          <h2 className="text-primary">core values</h2>
          <p className=" text-3xl">Curiosity. Vision. Collaboration.</p>
        </div>
      </div>
    </div>
  );
}
