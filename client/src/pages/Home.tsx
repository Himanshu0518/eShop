import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import NewArrivals from "@/components/NewArrivals";
import PromoSection from "@/components/PromoSection";
import Features from "@/components/Features";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedCategories />
      <NewArrivals />
      <PromoSection />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;
