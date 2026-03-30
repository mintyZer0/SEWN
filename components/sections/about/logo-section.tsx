import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="w-full py-10 flex flex-col items-center px-4">
      <div className="relative w-64 h-32 md:w-200 md:h-100">
        <Image
          src="/assets/logo.png"
          alt="SEWN Logo"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-lg md:text-2xl text-heading text-center mt-4 md:mt-0">
        SEWN-ulid ng Pilipino, Dangal ng Kababaihan
      </p>
    </div>
  );
}