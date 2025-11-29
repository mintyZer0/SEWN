import Image from "next/image";
import Link from "next/link";
export default function MeetOurSewers() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-dvw h-200 bg-orchid text-left justify-start p-8 px-16 text-9xl">
        <h2 className="text-secondary font-extralight my-8 mb-16 tracking-wide">
          a way to <br />
          <span className="font-normal">represent</span>
        </h2>
        <div className=" p-4 text-3xl text-secondary">
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
        <div className="flex items-center justify-center">
          <Link
            href=""
            className="text-3xl text-white bg-primary px-60 py-4 rounded-2xl hover:cursor-pointer hover:bg-secondary hover:text-primary mt-10"
          >
            {/* <button className="text-3xl text-white bg-primary px-60 py-4 rounded-2xl hover:cursor-pointer">
              Meet our Sewers
            </button> */}
            Meet our Sewers
          </Link>
        </div>
      </div>
      <div className="relative w-300 h-200">
        <Image
          src="/assets/meet-our-sewers.png"
          fill
          alt="meet our sewers"
          className="object-cover object-right"
        ></Image>
      </div>
    </div>
  );
}
