import Image from "next/image";

export default function AboutHero() {
  return (
    <div className="relative w-full h-[60vh] md:h-150 flex items-center justify-center">
      <Image
        src="/assets/about-page/bg-about.jpg"
        alt="About SEWN Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <div className="relative z-10 text-center px-6 md:px-8 max-w-4xl">
        <h1 className="text-5xl md:text-7xl text-white mb-4 md:mb-6">
          <span className="text-secondary">About </span>
          <strong className="font-medium">SEWN</strong>
        </h1>
        <p className="text-lg md:text-2xl text-white leading-relaxed">
          <strong className="font-medium">SEWN</strong>{" "}
          <span className="text-secondary">
            is an app-app that helps users find and hire local sewists. We stand
            from Higatay and are part of community contribution. This app
            matches the end-users with a qualified mannually skillful, their
            sewing needs—whether it's for custom clothing, alterations, or
            repairs.
          </span>
        </p>
      </div>
    </div>
  );
}
