import HomeHero from "@/components/sections/home/home-hero";
import NewProducts from "@/components/sections/home/new-products";
import Categories from "@/components/sections/home/categories";
import Browse from "@/components/sections/home/browse";
import MeetOurSewists from "@/components/sections/home/meet-our-sewists";
import TodaysFeaturedSewist from "@/components/sections/home/todays-featured-sewist";
import Mission from "@/components/ui/vision-mission";
import OurPartners from "@/components/sections/home/our-partners";
import FollowUs from "@/components/sections/home/follow-us";
import ParterTestimonials from "@/components/sections/home/partner-testimonials";
import Header from "@/global/Header";
import Footer from "@/global/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <HomeHero />
      <NewProducts />
      <Categories />
      <Browse />
      <MeetOurSewists />
      <TodaysFeaturedSewist />
      <Mission className="bg-light-pink" />
      <OurPartners />
      <ParterTestimonials />
      <FollowUs />
      <Footer />
    </>
  );
}
