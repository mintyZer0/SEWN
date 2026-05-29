import Image from "next/image";
import Link from "next/link";
export default function HomeHero() {
  return (
    <>
      <div className="relative flex flex-col w-full h-[60vh] md:h-230 overflow-hidden">
        <Image
          className="absolute z-0 object-cover"
          src="/assets/home-image.png"
          alt="icon"
          fill={true}
          sizes="100vw"
        ></Image>
        <div className="absolute inset-0 z-0 bg-black/35 md:bg-black/20"></div>
        <div className="relative z-10 flex-1 flex items-center">
          <div className="px-4 md:px-6 text-center w-full flex flex-col items-center">
            <h1 className="text-[26px] sm:text-3xl md:text-5xl lg:text-7xl text-white text-shadow-2xs font-normal md:italic max-w-[280px] md:max-w-none leading-snug">
              SEWN-ulid ng Pilipino, <br /> Dangal ng Kababaihan.
            </h1>
          </div>
        </div>
        <div className="relative z-10 flex justify-center pb-12 md:pb-20 -mt-10 sm:-mt-6">
          <Link
            href="/browse/shop"
            className="border-[1.5px] border-white text-white hover:bg-white hover:text-heading rounded-[12px] px-16 py-2.5 text-[15px] sm:text-lg md:text-2xl font-light tracking-wider transition-colors active:scale-95"
          >
            SHOP
          </Link>
        </div>
      </div>
    </>
  );
}
