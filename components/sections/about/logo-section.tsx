import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="w-full py-10 flex flex-col items-center">
      <div className="relative w-200 h-100">
        <Image
          src="/assets/logo.png"
          alt="SEWN Logo"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-2xl text-primary text-center">
        SEWN-ulid ng Pilipino, Dangal ng Kababaihan
      </p>
    </div>
  );
}
