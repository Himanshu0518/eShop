import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import Spinner from "./Spinner";
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  const { data: products, error, isLoading, isSuccess } = useGetProductsQuery();

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium">
              Just In
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="group flex items-center gap-2 text-sm tracking-wider font-medium hover:gap-3 transition-all duration-300 hover:text-foreground"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner className="h-8 w-8" />
              <p className="text-sm text-muted-foreground tracking-wider">
                Loading new arrivals...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="max-w-md text-center space-y-4 px-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-destructive"
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
                <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
                <p className="text-sm text-muted-foreground">
                  {(error as Error).message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isSuccess && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products?.data?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {isSuccess && products.data.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">No products available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for new arrivals!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
