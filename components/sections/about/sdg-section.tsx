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
    <div className="w-full bg-secondary-gradient-b py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-light text-center mb-8 md:mb-12">
          Sustainable Development Goals Addressed
        </h2>

        {/* Added flex-wrap and responsive icon sizing */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-8 md:mb-12">
          {sdgs.map((sdg) => (
            <div key={sdg.number} className="relative w-20 h-20 md:w-50 md:h-50">
              <Image
                src={sdg.icon}
                alt={`SDG ${sdg.number}`}
                fill
                className="rounded-2xl md:rounded-4xl object-cover"
              />
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-light text-heading-dark text-center mb-4 md:mb-6">
            Sustainable and Ethical Considerations
          </h3>
          <p className="text-lg md:text-2xl text-center leading-relaxed">
            The Republic Act (RA) No. 926 focuses on{" "}
            <strong>Magna Carta of Women</strong> under section 39,{" "}
            <strong>Right to Information</strong> - ensures that bearing
            community services have accessibility and right to information that
            will assist them with planning, managing, projects, and seeking
            justice that affect them.
            <br className="hidden md:block" />
            <em className="block mt-4 md:mt-0">(Philippine Commission on Women, 2009)</em>
          </p>
        </div>
      </div>
    </div>
  );
}