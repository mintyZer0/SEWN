interface CarouselProps {
  imageSrc: string;
  alt: string;
  category: string;
}
export default function CategoriesCarousel({
  imageSrc,
  alt,
  category,
}: CarouselProps) {
  return (
    <div className="carousel rounded-box">
      <div className="carousel-item relative">
        {/* <img src={imageSrc} alt={alt} /> */}
        <img
          src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
          alt="Pizza"
        />
        <div className="absolute left-0 bottom-0 z-2">
          <p>{category}</p>
        </div>
      </div>
    </div>
  );
}
