import Image from "next/image";
import Link from "next/link";
export default function MeetOurSewists() {
  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 min-h-[50vh] bg-gradient-to-br from-[#7B3B7B] to-[#CBA0CB] text-left justify-start p-6 md:p-8 px-6 md:px-16 text-4xl md:text-9xl">
        <h2 className="text-secondary font-extralight my-6 md:my-8 mb-6 md:mb-16 tracking-wide">
          a way to <br />
          <span className="font-normal">represent</span>
        </h2>
        <div className="py-2 md:p-4 text-lg md:text-2xl text-white">
          <p className="max-w-3xl leading-relaxed">
            Explore a wide variety of skilled local sewists ready to turn your
            ideas into beautiful, handcrafted creations.
            <br />
            <br /> We proudly support and showcase women artisans, helping them
            gain recognition, improve their craft, and access more
            opportunities, while giving you unique, high-quality pieces made
            with care.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center lg:justify-start w-full">
          <Link
            href="/browse/sewists"
            className="text-xl md:text-3xl text-center w-full md:w-auto text-white bg-primary px-6 md:px-24 lg:px-60 py-4 rounded-2xl hover:cursor-pointer hover:opacity-90 transition-opacity mt-8 md:mt-10 whitespace-nowrap"
          >
            Meet our Sewists
          </Link>
        </div>
      </div>
      <div className="relative w-full md:w-1/3 min-h-[40vh] md:min-h-full">
        <Image
          src="/assets/meet-our-sewists.png"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          alt="meet our sewists"
          className="object-cover object-center md:object-right"
        ></Image>
      </div>
    </div>
  );
}
