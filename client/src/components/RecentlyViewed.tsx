import { useGetViewsQuery } from "@/services/product.services";
import { useAppSelector } from "@/store/authSlice";
import Spinner from "./Spinner";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";

export default function RecentlyViewed() {
  const authStatus  = useAppSelector((state) => state.auth.status);
  
  
  const { data: recentProducts, error, isLoading, isSuccess } = useGetViewsQuery(undefined, {
    skip: !authStatus,
  });
  
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
      <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-sm text-muted-foreground tracking-wider">
                Loading recently viewed...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !isSuccess || !recentProducts?.data || recentProducts.data.length === 0) {
    return null;
  }

  const itemCount = recentProducts.data.length;
  const shouldScroll = itemCount > 4;

  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Your History
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
              Recently Viewed
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
              {recentProducts.data.map((view) => (
                <div
                  key={view.id}
                  className="shrink-0 w-[180px] sm:w-[220px] md:w-[260px]"
                >
                  <ProductCard product={view.product} />
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
            {recentProducts.data.map((view) => (
              <ProductCard key={view.id} product={view.product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
