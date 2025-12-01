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
    <div className="w-full bg-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">
          Management Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full border-primary border-2"
                />
              </div>
              <div className="bg-orchid-vertical-b text-white px-8 py-3 rounded-2xl text-center">
                <h3 className="text-xl font-regular">{member.name}</h3>
                <h4 className="text-xl font-light">{member.role}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
