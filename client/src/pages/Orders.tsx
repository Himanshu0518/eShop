import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function Orders() {
  // TODO: Replace with actual orders from state/API
  const orders: never[] = [];
  const isEmpty = orders.length === 0;

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
            My Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEmpty ? "No orders yet" : `${orders.length} orders`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" strokeWidth={1} />
            <h2 className="text-xl font-light mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              When you place an order, it will appear here. Start shopping to see your order history.
            </p>
            <Button asChild className="rounded-none px-8 h-11 text-xs tracking-widest uppercase">
              <Link to="/">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {/* Order items will go here */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
