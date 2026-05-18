import Image from "next/image";
import Link from "next/link";
export default function HomeHero() {
  return (
    <>
      <div className="relative flex flex-col justify-center items-center w-full h-[60vh] md:h-230 overflow-hidden">
        <Image
          className="absolute z-0 object-cover"
          src="/assets/home-image.png"
          alt="icon"
          fill={true}
          sizes="100vw"
        ></Image>
        <div className="flex items-center justify-center h-auto z-1 px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-7xl text-white text-shadow-2xs italic">
            SEWNulid ng Pilipino, <br /> Dangal ng Kababaihan
          </h1>
        </div>
        <button className="btn btn-outline border-white text-white border-2 hover:bg-white hover:text-heading absolute bottom-10 md:bottom-20 rounded-2xl z-1 px-18 md:px-18 md:py-4 text-xl md:text-2xl lg:text-4xl h-auto font-normal">
          <Link href="/browse/shop">BROWSE</Link>
        </button>
      </div>
    </>
  );
}
