import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/Hero1.png"
          alt="New Collection"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 lg:px-24">
        <div className="max-w-xl space-y-6">
          {/* Tag */}
          <span className="inline-block text-white/80 text-xs md:text-sm tracking-[0.3em] uppercase font-light">
            New Collection
          </span>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white tracking-tight leading-[1.1]">
            Summer
            <span className="block font-normal">Essentials</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg font-light max-w-md leading-relaxed">
            Discover our curated selection of timeless pieces designed for the modern lifestyle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-none px-8 py-6 text-sm tracking-wider font-medium transition-all duration-300 group"
            >
              Shop Women
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-none px-8 py-6 text-sm tracking-wider font-medium transition-all duration-300 bg-transparent"
            >
              Shop Men
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-white/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
