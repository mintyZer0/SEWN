import Image from "next/image";
import Link from "next/link";
export default function HomeHero() {
  return (
    <>
      <div className="relative flex flex-col justify-center items-center w-full h-[60vh] md:h-230 overflow-hidden mb-20">
        <Image
          className="absolute z-0 object-cover"
          src="/assets/home-image.png"
          alt="icon"
          fill={true}
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
      <div className="flex flex-row h-fit w-full align-middle justify-start bg-transparent gap-2 md:gap-4 overflow-hidden">
        <div className="bg-orchid h-auto w-2 md:w-40 lg:w-150 shrink-0"></div>
        <div className="flex flex-col w-full max-w-lg md:max-w-2xl gap-2 p-4 px-4 md:px-8">
          <p className="text-3xl lg:text-5xl text-heading ">our purpose.</p>
          <p className="text-black text-base md:text-lg lg:text-2xl">
            we celebrate the beauty and strength of womanhood by honoring the
            local heritage craftsmanship of homemaker-artisans, showcasing
            Filipino pride, creativity, and resilience rooted in the spititual
            and cultural identity of various village artisan communities in the
            philippines
          </p>
        </div>
        <div className="bg-orchid h-auto flex-1"></div>
      </div>
    </>
  );
}
