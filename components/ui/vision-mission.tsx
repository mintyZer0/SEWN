import { cn } from "@/lib/utils";

interface VisionMissionProps {
  className?: string;
}

export default function VisionMission({ className }: VisionMissionProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-hidden bg-[#FFE8F2] md:bg-transparent md:rounded-none md:mx-0 md:my-0",
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 p-8 sm:p-10 lg:p-25 place-items-center">
        <div className="flex flex-col text-center gap-4 w-full lg:w-140">
          <h2 className="text-3xl sm:text-4xl lg:text-7xl font-semibold text-heading">
            vision
          </h2>
          <p className="text-sm sm:text-base lg:text-3xl leading-relaxed text-foreground">
            To be the leading advocacy outlet that sustains Philippine
            Handicraft Traditions.
          </p>
        </div>
        <div className="flex flex-col text-center gap-4 w-full lg:w-140">
          <h2 className="text-3xl sm:text-4xl lg:text-7xl font-semibold text-heading">
            mission
          </h2>
          <p className="text-sm sm:text-base lg:text-3xl leading-relaxed text-foreground">
            To elevate the lives of homemaker-artisans by bridging livelihood and
            technology.
          </p>
        </div>
        <div className="flex flex-col text-center gap-4 w-full lg:w-140 lg:col-span-2">
          <h2 className="text-3xl sm:text-4xl lg:text-7xl font-semibold text-heading">
            core values
          </h2>
          <p className="text-sm sm:text-base lg:text-3xl leading-relaxed text-foreground">
            Curiosity. Vision. Collaboration.
          </p>
        </div>
      </div>
    </div>
  );
}