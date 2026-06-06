import Image from "next/image";
import Link from "next/link";
export default function MeetOurSewists() {
  return (
    <>
      <div className="md:hidden pt-8">
        <div className="relative min-h-[450px] w-full rounded-t-[40px] overflow-hidden">
          <Image
            src="/assets/meet-our-sewists.png"
            fill
            sizes="100vw"
            alt="meet our sewists"
            className="object-cover object-center"
          ></Image>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/20 to-[#CBA0CB]/90"></div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-[#FFE5FF]"></div>
          <div className="relative z-20 px-8 pt-12 pb-14 text-white">
            <h2 className="text-[40px] font-normal leading-[1.1] tracking-normal text-secondary">
              a way to <br />
              <span className="font-medium">represent sewists</span>
            </h2>
            <p className="mt-5 text-[13px] leading-relaxed tracking-wide text-white font-medium">
              Explore a wide variety of skilled local sewers ready to turn your
              ideas into beautiful, handcrafted creations.
              <span className="block mt-4">
                We proudly support and showcase women artisans, helping them
                gain recognition, improve their craft, and access more
                opportunities, while giving you unique, high-quality pieces
                made with care.
              </span>
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/browse/sewists"
                className="z-20000 inline-flex w-full items-center justify-center rounded-[14px] bg-primary px-6 py-3.5 text-[15px] font-bold text-white shadow-md transition-all active:scale-95"
              >
                Meet our Sewers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col md:flex-row w-full">
        <div className="flex flex-col w-full bg-gradient-to-br from-[#925FA6] to-[#CEA9D0] text-center items-center justify-center px-12 lg:px-24 py-8 lg:py-16">
          <h2 className="text-secondary text-6xl md:text-8xl lg:text-[130px] font-normal mb-8 lg:mb-12 leading-[1.05] tracking-normal text-left max-w-[1100px] w-full">
            a way to <br />
            <span className="font-medium">represent sewists</span>
          </h2>
          <div className="text-lg md:text-xl lg:text-[26px] text-white max-w-[1100px] space-y-8 font-normal text-left w-full">
            <p className="leading-relaxed">
              Explore a wide variety of skilled local sewers ready to turn your ideas into beautiful, <br className="hidden lg:block" />
              handcrafted creations.
            </p>
            <p className="leading-relaxed">
              We proudly support and showcase women artisans, helping them gain recognition, improve <br className="hidden lg:block" />
              their craft, and access more opportunities, while giving you unique, high-quality pieces made <br className="hidden lg:block" />
              with care.
            </p>
          </div>
          <div className="mt-16 lg:mt-24 w-full max-w-[1100px] flex justify-center">
            <Link
              href="/browse/sewists"
              className="text-xl lg:text-3xl text-center text-white bg-primary border-[3px] border-white px-28 lg:px-48 py-5 lg:py-6 rounded-full hover:bg-white hover:text-primary transition-all whitespace-nowrap font-medium shadow-md"
            >
              Meet our Sewists
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
