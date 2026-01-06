import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCartQuery, useUpdateQuantityMutation, useRemoveFromCartMutation } from "@/services/cart.services";
import Spinner from "@/components/Spinner";
import { BiError } from "react-icons/bi";
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppSelector } from "@/store/authSlice";

function Cart() {

  const authStatus = useAppSelector((state)=> state.auth.status)
  const { data: cartItems, isLoading, isError, isSuccess } = useGetCartQuery(
    authStatus ? undefined : skipToken
  );
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  const isEmpty = !cartItems?.data || cartItems.data.length === 0;

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity({ cartItemId: cartItemId, quantity: newQuantity }).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    setRemovingItemId(cartItemId);
    try {
      await removeFromCart(cartItemId).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingItemId(null);
    }
  };

  const calculateSubtotal = () => {
    if (!cartItems?.data) return 0;
    return cartItems.data.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
            Shopping Bag
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty ? "Your bag is empty" : `${cartItems?.data.length} ${cartItems?.data.length === 1 ? 'item' : 'items'}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Spinner />
              <p className="text-sm text-muted-foreground tracking-wider">Loading your cart...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center py-20">
            <div className="max-w-md text-center space-y-4 px-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <BiError className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Unable to load cart</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error loading your shopping bag. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {isSuccess && isEmpty && (
          <div className="text-center py-20">
            <ShoppingBag
              className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6"
              strokeWidth={1}
            />
            <h2 className="text-xl font-light mb-2">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Looks like you haven't added anything to your bag yet. Start shopping to fill it up!
            </p>
            <Button asChild className="rounded-none px-8 h-11 text-xs tracking-widest uppercase">
              <Link to="/">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Cart Items */}
        {isSuccess && !isEmpty && (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems?.data.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 pb-8 border-b border-border last:border-0 relative"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isRemoving && removingItemId === item.id}
                    className="absolute top-0 right-0 p-2 hover:bg-muted rounded-full transition-colors disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    {isRemoving && removingItemId === item.id ? (
                      <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="shrink-0 w-24 md:w-32 aspect-3/4 bg-muted overflow-hidden"
                  >
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between pr-8">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="hover:underline underline-offset-4"
                      >
                        <h3 className="font-normal tracking-wide mb-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.product.category}
                      </p>
                      {item.product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {item.product.description}
                        </p>
                      )}
                      <p className="font-medium">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-xs text-muted-foreground tracking-wider uppercase">
                        Quantity
                      </span>
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 text-sm font-medium min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 border border-border p-6 space-y-6">
                <h2 className="text-lg font-light tracking-wide">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping > 0 ? `$${shipping.toFixed(2)}` : "FREE"}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between text-base">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full rounded-none h-12 text-xs tracking-widest uppercase"
                >
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-none h-12 text-xs tracking-widest uppercase"
                >
                  <Link to="/">Continue Shopping</Link>
                </Button>

                <div className="pt-6 border-t border-border space-y-2 text-xs text-muted-foreground">
                  <p>• Free shipping on orders over $100</p>
                  <p>• Easy returns within 30 days</p>
                  <p>• Secure checkout guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;