import Image from "next/image";

export default function TesdaCertified() {
  return (
    <div className="flex items-center gap-10">
      <div className="relative w-55 h-55 shrink-0">
        <Image
          src="/assets/tesda-logo.png"
          alt="TESDA Certified"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-6xl font-light text-primary-dark">TESDA Certified</h3>
    </div>
  );
}
