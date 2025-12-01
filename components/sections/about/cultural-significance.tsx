import Image from "next/image";

export default function CulturalSignificance() {
  return (
    <div className="flex relative w-dvw bg-orchid-light">
      <div className="flex flex-1 gap-12 items-center">
        {/* Text Content */}
        <div className="text-white px-16">
          <h2 className="text-6xl mb-6">Cultural Significance</h2>
          <p className="text-3xl font-light leading-relaxed mb-4">
            Sewing is an art, representing of culture and tradition. Since
            nowadays, the younger generation is far from it. Our App aims to
            strengthen and promote the art for the new community who aspiring to
            be a seamster and be a part the community who is currently a
            seamster.
          </p>
        </div>

        {/* Image */}
        <div className="flex relative w-350 h-150">
          <Image
            src="/assets/about-page/cultural-significance-about.png"
            alt="Cultural Significance"
            fill
            className="object-top object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
