import Image from "next/image";

export default function CulturalSignificance() {
  return (
    <div className="flex relative w-full bg-orchid-light overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1 gap-8 md:gap-12 items-center w-full">
        {/* Text Content */}
        <div className="text-white px-6 md:px-16 py-10 md:py-0 w-full md:w-1/2">
          <h2 className="text-4xl md:text-6xl mb-4 md:mb-6 text-center md:text-left">Cultural Significance</h2>
          <p className="text-lg md:text-3xl font-light leading-relaxed mb-4 text-center md:text-left">
            Sewing is an art, representing of culture and tradition. Since
            nowadays, the younger generation is far from it. Our App aims to
            strengthen and promote the art for the new community who aspiring to
            be a seamster and be a part the community who is currently a
            seamster.
          </p>
        </div>

        {/* Image */}
        <div className="flex relative w-full md:w-1/2 h-64 md:h-150">
          <Image
            src="/assets/about-page/cultural-significance-about.png"
            alt="Cultural Significance"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top md:rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}