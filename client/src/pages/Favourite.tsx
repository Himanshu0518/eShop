import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, X, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  useGetFavoritesQuery, 
  useRemoveFromFavoriteMutation, 
} from "@/services/favourites.services";
import { useAddToCartMutation } from "@/services/cart.services";
import Spinner from "@/components/Spinner";
import { BiError } from "react-icons/bi";
import { useAppSelector } from "@/store/authSlice";
import { skipToken } from "@reduxjs/toolkit/query";

function Favourite() {
  const authStatus = useAppSelector((state)=> state.auth.status)

  const { data: favorites, isLoading, isError, isSuccess } = useGetFavoritesQuery(
    authStatus ? undefined : skipToken
  );
  const [removeFromFavorite, { isLoading: isRemoving }] = useRemoveFromFavoriteMutation();
  const [addToCart] = useAddToCartMutation();
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const isEmpty = !favorites?.data || favorites.data.length === 0;

  const handleRemoveFromWishlist = async (favoriteId: number) => {
    setRemovingItemId(favoriteId);
    try {
      await removeFromFavorite(favoriteId).unwrap();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleAddToCart = async (productId: number, favoriteId: number) => {
    setAddingToCartId(favoriteId);
    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      await removeFromFavorite(favoriteId).unwrap();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16 md:py-32">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-black mb-3">
            Wishlist
          </h1>
          <div className="h-px w-16 bg-black mb-6"></div>
          <p className="text-sm font-light text-gray-600 tracking-wide">
            {isEmpty ? "No saved items" : `${favorites?.data.length} ${favorites?.data.length === 1 ? 'item' : 'items'}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-40">
            <div className="text-center">
              <Spinner />
              <p className="mt-8 text-xs font-light text-gray-500 tracking-widest uppercase">
                Loading
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center py-40">
            <div className="max-w-md text-center">
              <BiError className="h-12 w-12 text-black mx-auto mb-6 opacity-30" />
              <h3 className="text-lg font-light text-black mb-2">Unable to load wishlist</h3>
              <p className="text-xs font-light text-gray-600 mb-8 leading-relaxed">
                There was an error loading your wishlist. Please try again.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full h-11 bg-black text-white hover:bg-gray-900 rounded-none text-xs font-light tracking-widest uppercase"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isSuccess && isEmpty && (
          <div className="text-center py-40">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-8 stroke-1" />
            <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-sm font-light text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
              Explore our collection and add your favorite pieces
            </p>
            <Button 
              asChild 
              className="h-11 px-12 bg-black text-white hover:bg-gray-900 rounded-none text-xs font-light tracking-widest uppercase"
            >
              <Link to="/">
                Shop Now
              </Link>
            </Button>
          </div>
        )}

        {/* Wishlist Grid */}
        {isSuccess && !isEmpty && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
              {favorites?.data.map((item) => (
                <div key={item.id} className="group">
                  {/* Product Card */}
                  <div className="space-y-5">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-50 aspect-3/4">
                      <Link to={`/product/${item.product.id}`} className="block h-full">
                        <img
                          src={item.product.img}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-95"
                        />
                      </Link>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={isRemoving && removingItemId === item.id}
                        className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-200 disabled:opacity-50"
                        aria-label="Remove from wishlist"
                      >
                        {isRemoving && removingItemId === item.id ? (
                          <div className="w-3.5 h-3.5 border border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                        ) : (
                          <X className="h-4 w-4 text-gray-800 hover:text-black transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <Link to={`/product/${item.product.id}`}>
                        <div className="space-y-1">
                          <span className="text-xs font-light text-gray-500 tracking-widest uppercase block">
                            {item.product.category}
                          </span>
                          <h3 className="text-sm font-light text-black group-hover:text-gray-700 transition-colors leading-snug">
                            {item.product.name}
                          </h3>
                        </div>
                      </Link>
                      
                      <p className="text-sm font-light text-black pt-1">
                        ${item.product.price.toFixed(2)}
                      </p>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(item.product.id, item.id)}
                        disabled={addingToCartId === item.id}
                        className="w-full h-10 bg-black text-white hover:bg-gray-900 rounded-none text-xs font-light tracking-widest uppercase disabled:opacity-60 transition-all duration-200 mt-2"
                      >
                        {addingToCartId === item.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                            Adding
                          </div>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                            Add to Bag
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-200 mb-12"></div>

            {/* Bottom Action */}
            <div className="flex justify-center">
              <Button
                asChild
                className="h-11 px-12 bg-white text-black border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-none text-xs font-light tracking-widest uppercase transition-all duration-200"
              >
                <Link to="/">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Favourite;