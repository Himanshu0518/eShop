import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Favourite() {
  // TODO: Replace with actual wishlist items from state/API
  const wishlistItems: never[] = [];
  const isEmpty = wishlistItems.length === 0;

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
            Wishlist
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty ? "No saved items" : `${wishlistItems.length} saved items`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" strokeWidth={1} />
            <h2 className="text-xl font-light mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Save your favorite items here to keep track of what you love and want to buy later.
            </p>
            <Button asChild className="rounded-none px-8 h-11 text-xs tracking-widest uppercase">
              <Link to="/">
                Explore Collections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Wishlist items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favourite;
