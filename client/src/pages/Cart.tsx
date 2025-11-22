import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Cart() {
  // TODO: Replace with actual cart items from state/API
  const cartItems: never[] = [];
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
            Shopping Bag
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty ? "Your bag is empty" : `${cartItems.length} items`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" strokeWidth={1} />
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
        ) : (
          /* Cart Items */
          <div className="space-y-8">
            {/* Cart items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
