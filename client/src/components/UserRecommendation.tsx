import { useGetRecommendationByUserQuery } from "@/services/product.services";
import { useAppSelector } from "@/store/authSlice";
import Spinner from "./Spinner";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";

export default function UserRecommendation() {
  const authStatus  = useAppSelector((state) => state.auth.status);
  
  
  const { data: products, error, isLoading, isSuccess } = useGetRecommendationByUserQuery(
    undefined,
    {
      skip: !authStatus,
    }
  );
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = 
        scrollContainerRef.current.scrollLeft + 
        (direction === "left" ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth"
      });
    }
  };

  if (!authStatus) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24  bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-sm text-muted-foreground tracking-wider">
                Loading  recommendation ...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !isSuccess || !products?.data || products.data.length === 0) {
    return null;
  }

  const itemCount = products.data.length;
  const shouldScroll = itemCount > 4;

  return (
    <section className="py-12 md:py-16 px-6 md:px-16 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
           
            <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
             You might like
            </h2>
          </div>

          {/* Scroll Buttons - Only show if more than 4 items */}
          {shouldScroll && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-border hover:bg-accent"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-border hover:bg-accent"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Conditional Layout Based on Item Count */}
        {shouldScroll ? (
          /* Horizontal Scroll for 5+ items */
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            >
              {products.data.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 w-[180px] sm:w-[220px] md:w-[260px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile Scroll Indicator */}
            <div className="md:hidden text-center mt-4">
              <p className="text-xs text-muted-foreground">← Swipe to see more →</p>
            </div>
          </div>
        ) : (
          /* Grid Layout for 1-4 items - Equal width spacing */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
