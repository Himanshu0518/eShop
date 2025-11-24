import { useParams, useNavigate } from "react-router-dom";
import { useGetProductQuery } from "@/services/product.services";
import { useAddToCartMutation } from "@/services/cart.services";
import { useToggleFavouriteMutation } from "@/services/favourites.services";
import { useState } from "react";
import { Heart, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import Spinner from "@/components/Spinner";

function Product() {
  const { productId } = useParams();
  console.log("Product ID:", productId);
  const navigate = useNavigate();
  const { data: product, isLoading, isError, isSuccess } = useGetProductQuery(Number(productId));
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [toggleFavorite] = useToggleFavouriteMutation();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: Number(productId),
        quantity,
      }).unwrap();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite({ productId: Number(productId) }).unwrap();
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner />
          <p className="mt-8 text-xs font-light text-gray-500 tracking-widest uppercase">
            Loading product
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-6"
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
          <h1 className="text-xl font-light text-black mb-2">Product not found</h1>
          <p className="text-sm font-light text-gray-600 mb-8">
            The product you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full h-11 bg-black text-white hover:bg-gray-900 rounded-none text-xs font-light tracking-widest uppercase transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const productData = product?.data;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-light text-gray-600 hover:text-black transition-colors tracking-widest uppercase"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <div>
            <div className="aspect-3/4 overflow-hidden bg-gray-50 mb-6">
              <img
                src={productData?.img}
                alt={productData?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-xs font-light text-gray-500 tracking-widest uppercase mb-3">
                {productData?.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">
                {productData?.name}
              </h1>
              <div className="h-px w-12 bg-black mb-6"></div>
              <p className="text-3xl font-light text-black">
                ${productData?.price?.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            {productData?.description && (
              <div>
                <p className="text-sm font-light text-gray-700 leading-relaxed">
                  {productData.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-xs font-light text-gray-600 tracking-widest uppercase block mb-4">
                Quantity
              </label>
              <div className="flex items-center gap-4 border border-gray-300 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                  disabled={quantity === 1}
                >
                  −
                </button>
                <span className="text-sm font-light text-black min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full h-12 bg-black text-white hover:bg-gray-900 disabled:opacity-70 rounded-none text-xs font-light tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Bag
                  </>
                ) : isAddingToCart ? (
                  <>
                    <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleToggleFavorite}
                
                className="w-full h-12 border border-gray-300 hover:border-black text-black rounded-none text-xs font-light tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isFavorite ? "fill-black text-black" : "text-gray-600"
                  }`}
                />
                {isFavorite ? "Saved" : "Save to Wishlist"}
              </button>
            </div>

            {/* Product Details */}
            <div className="pt-8 border-t border-gray-200 space-y-6">
              <div>
                <h3 className="text-xs font-light text-black tracking-widest uppercase mb-2">
                  Delivery & Returns
                </h3>
                <ul className="text-xs font-light text-gray-600 space-y-2">
                  <li>• Free standard delivery on orders over $100</li>
                  <li>• 30-day easy returns</li>
                  <li>• Ships within 1-2 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-light text-black tracking-widest uppercase mb-2">
                  Care Instructions
                </h3>
                <p className="text-xs font-light text-gray-600">
                  Machine wash cold with similar colors. Do not bleach. Hang dry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;