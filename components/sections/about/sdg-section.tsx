import Image from "next/image";

export default function SDGSection() {
  const sdgs = [
    { number: 1, icon: "/assets/about-page/sdg/sdg-1.png" },
    { number: 5, icon: "/assets/about-page/sdg/sdg-5.png" },
    { number: 8, icon: "/assets/about-page/sdg/sdg-8.png" },
    { number: 9, icon: "/assets/about-page/sdg/sdg-9.png" },
    { number: 17, icon: "/assets/about-page/sdg/sdg-17.png" },
  ];

  return (
    <div className="w-full bg-secondary-gradient-b py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-6xl font-light  text-center mb-12">
          Sustainable Development Goals Addressed
        </h2>

        {/* SDG Icons */}
        <div className="flex justify-center gap-12 mb-12">
          {sdgs.map((sdg) => (
            <div key={sdg.number} className="relative w-50 h-50">
              <Image
                src={sdg.icon}
                alt={`SDG ${sdg.number}`}
                fill
                className="rounded-4xl object-cover"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-5xl font-light text-primary-dark text-center mb-6">
            Sustainable and Ethical Considerations
          </h3>
          <p className="text-2xl text-center leading-relaxed">
            The Republic Act (RA) No. 926 focuses on{" "}
            <strong>Magna Carta of Women</strong> under section 39,{" "}
            <strong>Right to Information</strong> - ensures that bearing
            community services have accessibility and right to information that
            will assist them with planning, managing, projects, and seeking
            justice that affect them.
            <br />
            <em>(Philippine Commission on Women, 2009)</em>
          </p>
        </div>
      </div>
    </div>
  );
}
