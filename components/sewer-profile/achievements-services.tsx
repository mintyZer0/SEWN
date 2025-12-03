import TesdaCertified from "@/components/ui/tesda-certified";

interface AchievementsServicesProps {
  achievements: string[];
  tesdaCertified: boolean;
  servicesOffered: ("repair" | "alteration" | "commission")[];
}
export default function AchievementsServices({
  achievements,
  tesdaCertified,
  servicesOffered,
}: AchievementsServicesProps) {
  return (
    <div className="flex flex-col max-w-dvw h-auto p-12 mx-20">
      <div className="flex flex-col gap-6 mb-12">
        <h2 className="font-light text-6xl text-primary-dark">Achievements</h2>
        {achievements.map((achievement, index) => (
          <li key={index} className="text-xl font-light ">
            {achievement}
          </li>
        ))}
      </div>
      <div className="flex flex-row max-w-dvw justify-between py-8">
        {tesdaCertified ? <TesdaCertified /> : null}
        <div className="flex flex-col ml-20 gap-4 items-end ">
          <h3 className="text-5xl font-light text-primary-dark">
            {" "}
            Services Offered
          </h3>
          {servicesOffered.map((service, index) => (
            <ul key={index} className="text-2xl font-light ">
              <li className="capitalize">{service}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
