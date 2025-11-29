import { Heart, ShoppingCart, Search, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import { useAddToCartMutation } from "@/services/cart.services";
import { useToggleFavouriteMutation } from "@/services/favourites.services";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product.types";
import { useSelector } from "react-redux";

export default function NewArrivals() {
  const { data: allProducts, error, isLoading, isSuccess } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const [toggleFavourite] = useToggleFavouriteMutation();
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: { cart: boolean; fav: boolean } }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deepSearch, setDeepSearch] = useState<boolean>(false);
  const authStatus = useSelector((state: any) => state.auth.status);
 
  const handleAddToCart = async (e: React.MouseEvent, productId: number, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!authStatus) {
      toast.error("Please login to add items to cart");
      return;
    }
    
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
    
    if (!authStatus) {
      toast.error("Please login to add items to favourites");
      return;
    }
    
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = allProducts?.data?.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered) {
        setProducts(filtered);
      }
    } else {
      setProducts(allProducts?.data ?? []);
    }
  }, [searchTerm, allProducts]);

  return (
    <section className="py-12 md:py-20 px-6 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 space-y-6">
          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium">
                Just In
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
                New Arrivals
              </h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-input bg-background pl-12 pr-14 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={() => setDeepSearch(!deepSearch)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${
                  deepSearch 
                    ? 'text-yellow-500 bg-yellow-500/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Deep Search (Coming Soon)"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>
            {deepSearch && (
              <p className="mt-2 text-xs text-muted-foreground italic">
                🔍 Deep semantic search coming soon...
              </p>
            )}
          </div>
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

        {/* No Results State */}
        {isSuccess && products.length === 0 && searchTerm && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No products found for "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {isSuccess && products.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block">
                <div className="space-y-4">
                  {/* Image Container */}
                  <div className="aspect-3/4 overflow-hidden bg-muted relative rounded-lg">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Desktop: Hover Overlay with buttons - Only if authenticated */}
                    {authStatus && (
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
                    )}

                    {/* Mobile: Always visible icon buttons at top right - Only if authenticated */}
                    {authStatus && (
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
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1 px-1">
                    <h3 className="text-sm md:text-base font-normal tracking-wide group-hover:underline underline-offset-4 line-clamp-2">
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