import Header from "../global/Header";
import HomeHero from "@/components/sections/home/home-hero";
import NewProducts from "@/components/sections/home/new-products";

export default function Home() {
  return (
    <>
      <Header />
      <HomeHero />
      <NewProducts />
    </>
  );
}
