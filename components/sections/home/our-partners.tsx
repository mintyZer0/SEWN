import Image from "next/image";

export default function OurPartners() {
  return (
    <div className="relative w-full h-120 flex items-center justify-center">
      <Image
        src="/assets/our-partners-background.jpg"
        alt="Our Partners Background"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-6xl px-8">
        <h2 className="text-6xl font-bold text-white text-center">
          Our Partners
        </h2>

        <div className="flex items-center justify-center gap-8 bg-white/70  backdrop-blur-sm rounded-2xl px-12 py-8 w-full">
          <div className="relative w-42 h-30">
            <Image
              src="/assets/lgu-logo.png"
              alt="LGU"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-42 h-30">
            <Image
              src="/assets/dost-logo.png"
              alt="DOST"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-42 h-30">
            <Image
              src="/assets/dti-logo.png"
              alt="DTI"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-42 h-30">
            <Image
              src="/assets/koica-logo.png"
              alt="KOICA"
              fill
              className="object-contain"
            />
          </div>
          <div className="relative w-42 h-30 flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-700 select-none">
              NGO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
