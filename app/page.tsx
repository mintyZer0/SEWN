import Header from "../global/Header";
import HomeHero from "@/components/sections/home/home-hero";
import NewProducts from "@/components/sections/home/new-products";
import Categories from "@/components/sections/home/categories";
import Services from "@/components/sections/home/services";
import MeetOurSewers from "@/components/sections/home/meet-our-sewers";
export default function Home() {
  return (
    <>
      <Header />
      <HomeHero />
      <NewProducts />
      <Categories />
      <Services />
      <MeetOurSewers />
    </>
  );
}
