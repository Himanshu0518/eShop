import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import { useAddToCartMutation } from "@/services/cart.services";
import { useToggleFavouriteMutation } from "@/services/favourites.services";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function NewArrivals() {
  const { data: products, error, isLoading, isSuccess } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const [toggleFavourite] = useToggleFavouriteMutation();
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: { cart: boolean; fav: boolean } }>({});

  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoadingStates(prev => ({ ...prev, [productId]: { ...prev[productId], cart: true } }));
    
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      toast.success(`${productName} added to cart!`, {
        description: "You can view it in your cart",
      });
    } catch (error: any) {
      toast.error("Failed to add to cart", {
        description: error?.data?.message || "Please try again",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: { ...prev[productId], cart: false } }));
    }
  };

  const handleToggleFavourite = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoadingStates(prev => ({ ...prev, [productId]: { ...prev[productId], fav: true } }));
    
    try {
      await toggleFavourite({ productId }).unwrap();
      toast.success(`${productName} added to favourites!`, {
        description: "View your favourites anytime",
      });
    } catch (error: any) {
      toast.error("Failed to update favourites", {
        description: error?.data?.message || "Please try again",
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: { ...prev[productId], fav: false } }));
    }
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Just In
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="group flex items-center gap-2 text-sm tracking-wider hover:gap-3 transition-all duration-300"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-sm text-muted-foreground tracking-wider">Loading new arrivals...</p>
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
                <h3 className="text-lg font-medium mb-2">Unable to load products</h3>
                <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {isSuccess && products.data.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block">
                <div className="space-y-4">
                  {/* Image Container */}
                  <div className="aspect-3/4 overflow-hidden bg-muted relative">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Desktop: Hover Overlay with buttons */}
                    <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-12 w-12 shadow-lg"
                        onClick={(e) => handleToggleFavourite(e, product.id, product.name)}
                        disabled={loadingStates[product.id]?.fav}
                      >
                        {loadingStates[product.id]?.fav ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          <Heart className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-12 w-12 shadow-lg"
                        onClick={(e) => handleAddToCart(e, product.id, product.name)}
                        disabled={loadingStates[product.id]?.cart}
                      >
                        {loadingStates[product.id]?.cart ? (
                          <Spinner className="h-5 w-5" />
                        ) : (
                          <ShoppingCart className="h-5 w-5" />
                        )}
                      </Button>
                    </div>

                    {/* Mobile: Always visible icon buttons at top right */}
                    <div className="md:hidden absolute top-2 right-2 flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-9 w-9 shadow-md bg-white/90 hover:bg-white"
                        onClick={(e) => handleToggleFavourite(e, product.id, product.name)}
                        disabled={loadingStates[product.id]?.fav}
                      >
                        {loadingStates[product.id]?.fav ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full h-9 w-9 shadow-md bg-white/90 hover:bg-white"
                        onClick={(e) => handleAddToCart(e, product.id, product.name)}
                        disabled={loadingStates[product.id]?.cart}
                      >
                        {loadingStates[product.id]?.cart ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-normal tracking-wide group-hover:underline underline-offset-4">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
