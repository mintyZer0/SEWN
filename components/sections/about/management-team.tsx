import Image from "next/image";

export default function ManagementTeam() {
  const team = [
    {
      name: "Renerie Dela Cruz",
      role: "Founder/Market Researcher",
      image: "/assets/about-page/management-photos/ren.jpg",
    },
    {
      name: "Eithan Mathew Malonzo",
      role: "Web Developer",
      image: "/assets/about-page/management-photos/eithan.jpg",
    },
    {
      name: "Kharl Asuncion",
      role: "UI/UX Developer",
      image: "/assets/about-page/management-photos/kharl.png",
    },
  ];

  return (
    <div className="w-full bg-white py-12 md:py-16 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-heading text-center mb-8 md:mb-12">
          Management Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="object-cover rounded-full border-primary border-2"
                />
              </div>
              <div className="bg-orchid-vertical-b text-white px-6 py-2 md:px-8 md:py-3 rounded-2xl text-center w-full max-w-[250px]">
                <h3 className="text-lg md:text-xl font-regular">{member.name}</h3>
                <h4 className="text-base md:text-xl font-light">{member.role}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}