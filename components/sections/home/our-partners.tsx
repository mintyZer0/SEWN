import Image from "next/image";

export default function OurPartners() {
  const partners = [
    {
      name: "LGU",
      logo: "/assets/key-partner-logos/lgu-logo.png",
      isImage: true,
    },
    {
      name: "DOST",
      logo: "/assets/key-partner-logos/dost-logo.png",
      isImage: true,
    },
    {
      name: "DTI",
      logo: "/assets/key-partner-logos/dti-logo.png",
      isImage: true,
    },
    {
      name: "KOICA",
      logo: "/assets/key-partner-logos/koica-logo.png",
      isImage: true,
    },
    {
      name: "PCCI",
      logo: "/assets/key-partner-logos/pcci-logo.png",
      isImage: true,
    },
    {
      name: "DICT",
      logo: "/assets/key-partner-logos/dict-logo.png",
      isImage: true,
    },
    {
      name: "GUITEB",
      logo: "/assets/key-partner-logos/guiteb.png",
      isImage: true,
    },
    {
      name: "Igting",
      logo: "/assets/key-partner-logos/igting.png",
      isImage: true,
    },
    { name: "NGO", isImage: false },
  ];

  return (
    <div className="relative w-full h-120 flex items-center justify-center bg-linear-to-t from-40% from-[#7B3B7B] to-[#FFE063] ">
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-7xl px-8">
        <h2 className="text-6xl font-bold text-white text-center">
          Our Partners
        </h2>

        <div className="flex items-center justify-center gap-8 bg-white/70 backdrop-blur-sm rounded-2xl px-12 py-8 w-full">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative w-42 h-30 flex items-center justify-center"
            >
              {partner.isImage && partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <span className="text-6xl font-bold text-gray-700 select-none">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
