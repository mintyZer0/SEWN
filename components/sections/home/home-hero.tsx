import Image from "next/image";
export default function HomeHero() {
  return (
    <>
      <div className="relative flex flex-col justify-center items-center w-full h-230 overflow-hidden mb-20">
        <Image
          className="absolute z-0 object-cover"
          src="/assets/home-image.png"
          alt="icon"
          fill={true}
        ></Image>
        <div className="flex items-center justify-center h-auto z-1">
          <h1 className="text-4xl sm:text-7xl text-white text-shadow-2xs italic">
            SEWNulid ng Pilipino, <br /> Dangal ng Kababaihan
          </h1>
        </div>
        <button className="btn btn-outline border-white text-white border-2 hover:bg-white hover:text-primary absolute bottom-20 rounded-2xl z-1 px-18 py-4 text-2xl sm:text-4xl h-auto font-normal">
          BROWSE
        </button>
      </div>
      <div className="flex flex-row h-fit w-dvw align-middle justify-start bg-transparent gap-2">
        <div className="bg-orchid h-auto w-150"></div>
        <div className="flex flex-col w-400 gap-2 p-4 px-8">
          <p className="text-3xl sm:text-5xl text-primary ">our purpose.</p>
          <p className="text-black text-lg sm:text-2xl">
            we celebrate the beauty and strength of womanhood by honoring the
            local heritage craftsmanship of homemaker-artisans, showcasing
            Filipino pride, creativity, and resilience rooted in the spititual
            and cultural identity of various village artisan communities in the
            philippines
          </p>
        </div>
        <div className="bg-orchid h-auto w-dvw"></div>
      </div>
    </>
  );
}
