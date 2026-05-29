import Image from "next/image";

export default function OurPartners() {
  const partners = [
    { name: "LGU", logo: "/assets/key-partner-logos/lgu-logo.png", isImage: true },
    { name: "DOST", logo: "/assets/key-partner-logos/dost-logo.png", isImage: true },
    { name: "DTI", logo: "/assets/key-partner-logos/dti-logo.png", isImage: true },
    { name: "KOICA", logo: "/assets/key-partner-logos/koica-logo.png", isImage: true },
    { name: "NGO", isImage: false },
    { name: "PCCI", logo: "/assets/key-partner-logos/pcci-logo.png", isImage: true },
    { name: "DICT", logo: "/assets/key-partner-logos/dict-logo.png", isImage: true },
    { name: "Igting", logo: "/assets/key-partner-logos/igting.png", isImage: true },
  ];

  return (
    <div className="relative w-full h-auto md:min-h-[50vh] flex items-center justify-center py-10 md:py-12 md:overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-12 w-full max-w-4xl md:max-w-5xl px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold md:font-normal text-primary md:text-primary text-center">
          Our Partners
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-8 sm:gap-x-16 sm:gap-y-10 md:gap-x-20 md:gap-y-16 w-full place-items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative w-28 h-14 sm:w-32 sm:h-16 md:w-36 md:h-24 flex items-center justify-center"
            >
              {partner.isImage && partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 768px) 128px, 144px"
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-700 md:text-[#38628b] select-none">
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