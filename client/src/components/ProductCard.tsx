import { Heart, ShoppingCart } from "lucide-react";
import { useAddToCartMutation } from "@/services/cart.services";
import { useToggleFavouriteMutation } from "@/services/favourites.services";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import type{Product} from  "@/types/product.types";


interface ProductCardProps {
  product: Product;
}

function ProductCard({product}: ProductCardProps) {
  const [addToCart] = useAddToCartMutation();
  const [toggleFavourite] = useToggleFavouriteMutation();
 

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
    productName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingStates((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], fav: true },
    }));

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
      setLoadingStates((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], fav: false },
      }));
    }
  };

  return (
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
                onClick={(e) =>
                  handleToggleFavourite(e, product.id, product.name)
                }
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
                onClick={(e) =>
                  handleToggleFavourite(e, product.id, product.name)
                }
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
            <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
