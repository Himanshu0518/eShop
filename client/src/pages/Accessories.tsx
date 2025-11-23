import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import Spinner from "@/components/Spinner";

export default function Accessories() {
  const { data: products, error, isLoading, isSuccess } = useGetProductsQuery();

  // Filter only accessories's products
  const ancessoriesProducts =
  products?.data?.filter((product) =>
    product.category.some((c) => c.toLowerCase() === "kids")
  ) || [];


  return (
    <section className="py-20 md:py-32 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="mb-6">
            <span className="text-xs font-light text-gray-500 tracking-[0.2em] uppercase">
              New Collection
            </span>
            <h2 className="mt-4 text-5xl md:text-6xl font-light tracking-tight text-black">
              Accessories 
            </h2>
          </div>
          <div className="h-px w-16 bg-black"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Spinner />
              <p className="mt-8 text-xs font-light text-gray-500 tracking-widest uppercase">
                Loading
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-32">
            <div className="max-w-md text-center">
              <svg
                className="w-12 h-12 text-black mx-auto mb-6 opacity-30"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-lg font-light text-black mb-2">Unable to load products</h3>
              <p className="text-xs font-light text-gray-600">{(error as Error).message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isSuccess && ancessoriesProducts.length === 0 && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <p className="text-sm font-light text-gray-600 mb-6">No ancessory products available</p>
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 text-xs font-light text-black tracking-widest uppercase hover:text-gray-600 transition-colors"
              >
                View All Products
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isSuccess && ancessoriesProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8 mb-16">
              {ancessoriesProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group">
                  <div className="space-y-6">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50 aspect-3/4">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-95"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-light text-gray-500 tracking-widest uppercase mb-2">
                          {product.category}
                        </p>
                        <h3 className="text-sm font-light text-black group-hover:text-gray-600 transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </div>
                      <p className="text-sm font-light text-black pt-1">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          
          
          </>
        )}
      </div>
    </section>
  );
}