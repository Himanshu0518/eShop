// import { ArrowRight } from "lucide-react";
import { useGetViewsQuery } from "@/services/product.services";
import Spinner from "./Spinner";
import ProductCard from "./ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function RecentlyViewed() {
  const { data: recentProducts, error, isLoading, isSuccess } = useGetViewsQuery();

  return (
    <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
           
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
              Recently Viewed
            </h2>
          </div>
        
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-sm text-muted-foreground tracking-wider">
                please wait ...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="max-w-md text-center space-y-4 px-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-destructive"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Unable to load products
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(error as Error).message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products scroll area */}
  
  <ScrollArea>
     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {isSuccess &&
            recentProducts.data.map((views) => (
                <ProductCard key={views.id} product={views.product} />
              ))}
        </div>
  </ScrollArea>

       
      </div>
    </section>
  );
}
