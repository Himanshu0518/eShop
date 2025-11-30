import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewArrivals from "@/components/NewArrivals";
import PromoSection from "@/components/PromoSection";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import RecentlyViewed from "@/components/RecentlyViewed";
import UserRecommendation from "@/components/UserRecommendation";

function Home() {
 

  return (
    <>
      <Hero />
      <Features />
      <RecentlyViewed />
      <UserRecommendation />
      <FeaturedCategories />
      <NewArrivals />
      <PromoSection />
      <Newsletter />
      
    </>
  );
}

export default Home;
