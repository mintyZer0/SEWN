import TesdaCertified from "@/components/ui/tesda-certified";

interface AchievementsServicesProps {
  achievements: string[];
  tesdaCertified: boolean;
}
export default function AchievementsServices({
  achievements,
  tesdaCertified,
}: AchievementsServicesProps) {
  return (
    <div className="flex flex-col max-w-dvw h-auto p-6 sm:p-10 md:p-12 mx-4 sm:mx-10 md:mx-20">
      <div className="flex flex-col gap-6 mb-12">
        <h2 className="font-light text-3xl sm:text-4xl md:text-6xl text-heading-dark">Achievements</h2>
        {achievements.map((achievement, index) => (
          <li key={index} className="text-base sm:text-lg md:text-xl font-light ">
            {achievement}
          </li>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row max-w-dvw justify-center sm:justify-between py-6 sm:py-8">
        {tesdaCertified ? <TesdaCertified /> : null}
      </div>
    </div>
  );
}
