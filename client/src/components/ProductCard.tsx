import { Heart, ShoppingCart } from "lucide-react";
import { useAddToCartMutation } from "@/services/cart.services";
import {
  useToggleFavouriteMutation,
  useGetFavoritesQuery,
} from "@/services/favourites.services";
import { useAppSelector } from "@/store/authSlice";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import type { Product } from "@/types/product.types";
import { skipToken } from "@reduxjs/toolkit/query";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const authStatus = useAppSelector((state) => state.auth.status);
  const isLoggedIn = !!currentUser?.data;

  const [addToCart] = useAddToCartMutation();
  const [toggleFavourite] = useToggleFavouriteMutation();
  const { data: favouriteProducts, isLoading } = useGetFavoritesQuery(
    authStatus ? undefined : skipToken
  );

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (favouriteProducts?.data && product?.id) {
      const isFav = favouriteProducts.data.some((fav) => fav.id === product.id);
      setIsFavorite(!!isFav);
    }
  }, [favouriteProducts?.data, product?.id]);

  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: { cart: boolean; fav: boolean };
  }>({});

  const handleAddToCart = async (
    e: React.MouseEvent,
    productId: number,
    productName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to add items to cart", {
        description: "You'll be redirected to login page",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], cart: true },
    }));

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
      setLoadingStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], cart: false },
      }));
    }
  };

  const handleToggleFavourite = async (
    e: React.MouseEvent,
    productId: number,
    
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to add items to favourites", {
        description: "You'll be redirected to login page",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    setLoadingStates((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], fav: true },
    }));

    // Store the current state before toggling
    const previousFavState = isFavorite;
    const newFavState = !previousFavState;

    try {
      // Optimistically update UI
      setIsFavorite(newFavState);

      const response = await toggleFavourite({ productId }).unwrap();

      // Show appropriate toast based on new state
      toast.success(response.message);
    } catch (error: any) {
      // Revert to previous state on error
      setIsFavorite(previousFavState);
      toast.error("Failed to update favourites", {
        description: error?.data?.message || "Please try again",
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], fav: false },
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="space-y-4">
          {/* Image Container */}
          <div className="aspect-3/4 overflow-hidden bg-muted relative">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Desktop: Hover Overlay with buttons (Only if logged in) */}
            {isLoggedIn && (
              <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-12 w-12 shadow-lg hover:scale-110 transition-transform bg-white hover:bg-white"
                  onClick={(e) =>
                    handleToggleFavourite(e, product.id)
                  }
                  disabled={loadingStates[product.id]?.fav}
                >
                  {loadingStates[product.id]?.fav ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <Heart
                      className={`h-5 w-5 transition-all ${
                        isFavorite
                          ? "fill-gray-700 text-gray-700 stroke-2" // Changed from red to gray
                          : "text-gray-700 stroke-2"
                      }`}
                    />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-12 w-12 shadow-lg hover:scale-110 transition-transform bg-white hover:bg-white"
                  onClick={(e) => handleAddToCart(e, product.id, product.name)}
                  disabled={loadingStates[product.id]?.cart}
                >
                  {loadingStates[product.id]?.cart ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <ShoppingCart className="h-5 w-5 text-gray-700 stroke-2" />
                  )}
                </Button>
              </div>
            )}

            {/* Mobile: Always visible icon buttons at top right (Only if logged in) */}
            {isLoggedIn && (
              <div className="md:hidden absolute top-2 right-2 flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 shadow-lg bg-white/95 hover:bg-white backdrop-blur-sm"
                  onClick={(e) =>
                    handleToggleFavourite(e, product.id)
                  }
                  disabled={loadingStates[product.id]?.fav}
                >
                  {loadingStates[product.id]?.fav ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Heart
                      className={`h-4.5 w-4.5 transition-all ${
                        isFavorite
                          ? "fill-gray-700 text-gray-700 stroke-2" // Changed from red to gray
                          : "text-gray-700 stroke-2"
                      }`}
                    />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-10 w-10 shadow-lg bg-white/95 hover:bg-white backdrop-blur-sm"
                  onClick={(e) => handleAddToCart(e, product.id, product.name)}
                  disabled={loadingStates[product.id]?.cart}
                >
                  {loadingStates[product.id]?.cart ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <ShoppingCart className="h-4.5 w-4.5 text-gray-700 stroke-2" />
                  )}
                </Button>
              </div>
            )}

            {/* Discount Badge - Black on White (Zara style) */}
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-black text-white text-xs font-medium px-2.5 py-1 tracking-wider">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2 px-1">
            <h3 className="text-sm md:text-base font-normal tracking-wide group-hover:underline underline-offset-4 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              {product.discount > 0 ? (
                <>
                  <p className="text-sm md:text-base font-medium text-foreground">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="text-sm md:text-base font-medium text-foreground">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
