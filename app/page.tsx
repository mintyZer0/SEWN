import Header from "../global/Header";
import HomeHero from "@/components/sections/home/home-hero";
import NewProducts from "@/components/sections/home/new-products";
import Categories from "@/components/sections/home/categories";
import Browse from "@/components/sections/home/browse";
import MeetOurSewers from "@/components/sections/home/meet-our-sewers";
import TodaysFeaturedSewer from "@/components/sections/home/todays-featured-sewer";
import Mission from "@/components/ui/vision-mission";
import OurPartners from "@/components/sections/home/our-partners";
import FollowUs from "@/components/sections/home/follow-us";
import ParterTestimonials from "@/components/sections/home/partner-testimonials";
export default function Home() {
  return (
    <>
      <HomeHero />
      <NewProducts />
      <Categories />
      <Browse />
      <MeetOurSewers />
      <TodaysFeaturedSewer />
      <Mission />
      <ParterTestimonials />
      <FollowUs />
      <OurPartners />
    </>
  );
}
