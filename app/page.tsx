import Header from "../global/Header";
import HomeHero from "@/components/sections/home/home-hero";
import NewProducts from "@/components/sections/home/new-products";
import Categories from "@/components/sections/home/categories";
import Services from "@/components/sections/home/services";
import MeetOurSewers from "@/components/sections/home/meet-our-sewers";
import TodaysFeaturedSewer from "@/components/sections/home/todays-featured-sewer";
import Mission from "@/components/sections/home/mission";
import OurPartners from "@/components/sections/home/our-partners";
import FollowUs from "@/components/sections/home/follow-us";
export default function Home() {
  return (
    <>
      <HomeHero />
      <NewProducts />
      <Categories />
      <Services />
      <MeetOurSewers />
      <TodaysFeaturedSewer />
      <Mission />
      <OurPartners />
      <FollowUs />
    </>
  );
}
