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
    <div className="flex flex-col max-w-dvw h-auto p-12 mx-20">
      <div className="flex flex-col gap-6 mb-12">
        <h2 className="font-light text-6xl text-heading-dark">Achievements</h2>
        {achievements.map((achievement, index) => (
          <li key={index} className="text-xl font-light ">
            {achievement}
          </li>
        ))}
      </div>
      <div className="flex flex-row max-w-dvw justify-between py-8">
        {tesdaCertified ? <TesdaCertified /> : null}
      </div>
    </div>
  );
}
