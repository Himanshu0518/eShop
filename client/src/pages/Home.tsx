import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewArrivals from "@/components/NewArrivals";
import PromoSection from "@/components/PromoSection";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";


function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedCategories />
      <NewArrivals />
      <PromoSection />
      <Newsletter />
      
    </>
  );
}

export default Home;
