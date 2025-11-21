import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState<number[]>([]);

  const heroSlides = [
    {
      image: "/Hero1.png",
      title: "New Season",
      subtitle: "Discover the latest trends",
      cta: "Shop Now",
      theme: "light"
    },
    {
      image: "/Hero2.png",
      title: "Limited Edition",
      subtitle: "Exclusive collections just for you",
      cta: "Explore Collection",
      theme: "dark"
    },
    {
      image: "/Hero3.png",
      title: "New Arrivals",
      subtitle: "Up to 50% off on selected items",
      cta: "Grab the Deals",
      theme: "light"
    },
    {
      image: "/Hero4.png",
      title: "Winter Sale",
      subtitle: "Discover the latest arrivals",
      cta: "Shop Now",
      theme: "dark"
    }
  ];

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSlides(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full select-none">
      {/* Embla Viewport */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide, index) => (
            <div className="flex-[0_0_100%] relative h-[65vh] md:h-[70vh] lg:h-[75vh]" key={index}>
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content Overlay */}
              <div
                className={`absolute inset-0 flex items-center md:items-end pb-8 md:pb-12 lg:pb-16 px-6 md:px-10 lg:px-16 xl:px-20 transition-all duration-700 ${
                  selectedIndex === index 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="max-w-xl lg:max-w-2xl">
                  <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-3 md:mb-4 ${
                    slide.theme === "light" ? "text-white" : "text-white"
                  }`}>
                    {slide.title}
                  </h1>
                  <p className={`text-base md:text-lg lg:text-xl mb-6 md:mb-8 font-light ${
                    slide.theme === "light" ? "text-white/90" : "text-white/90"
                  }`}>
                    {slide.subtitle}
                  </p>
                  <Button 
                    size="lg"
                    className="group bg-white text-black hover:bg-white/90 transition-all duration-300 px-6 md:px-8 py-5 md:py-6 text-sm md:text-base"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 md:mt-6 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              selectedIndex === index 
                ? "bg-foreground w-6 md:w-8" 
                : "bg-muted-foreground/30 w-1.5 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}