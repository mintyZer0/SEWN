import CategoriesCarousel from "../../ui/categories-carousel";
export default function Categories() {
  const itemsList = [
    {
      imageSrc: "/assets/categories1.jpg",
      alt: "product",
      category: "shirts",
      id: "1",
    },
    {
      imageSrc: "/assets/categories2.jpg",
      alt: "product",
      category: "skirts",
      id: "2",
    },
    {
      imageSrc: "/assets/categories3.jpg",
      alt: "product",
      category: "dresses",
      id: "3",
    },
    {
      imageSrc: "/assets/categories3.jpg",
      alt: "product",
      category: "dresses",
      id: "4",
    },
    {
      imageSrc: "/assets/categories3.jpg",
      alt: "product",
      category: "dresses",
      id: "5",
    },
  ];
  return (
    <>
      <div className="flex mx-8">
        <h2 className="lg:text-5xl sm:text-4xl text-3xl text-primary">
          categories
        </h2>
      </div>
      <CategoriesCarousel items={itemsList}></CategoriesCarousel>
    </>
  );
}
