import Image from "next/image";
import Link from "next/link";
export default function MeetOurSewers() {
  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="flex flex-col w-full md:w-2/3 min-h-[50vh] bg-orchid text-left justify-start p-6 md:p-8 px-6 md:px-16 text-4xl md:text-9xl">
        <h2 className="text-secondary font-extralight my-6 md:my-8 mb-6 md:mb-16 tracking-wide">
          a way to <br />
          <span className="font-normal">represent</span>
        </h2>
        <div className="py-2 md:p-4 text-lg md:text-3xl text-secondary">
          <p>
            Explore a wide variety of skilled local sewers ready to turn your
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
            href=""
            className="text-xl md:text-3xl text-center w-full md:w-auto text-white bg-primary px-6 md:px-24 lg:px-60 py-4 rounded-2xl hover:cursor-pointer hover:opacity-90 transition-opacity mt-8 md:mt-10 whitespace-nowrap"
          >
            Meet our Sewers
          </Link>
        </div>
      </div>
      <div className="relative w-full md:w-1/3 min-h-[40vh] md:min-h-full">
        <Image
          src="/assets/meet-our-sewers.png"
          fill
          alt="meet our sewers"
          className="object-cover object-center md:object-right"
        ></Image>
      </div>
    </div>
  );
}