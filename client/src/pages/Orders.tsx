import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Clock, CheckCircle2, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@/services/order.services";

function Orders() {
  const { data: ordersData, isLoading, isError } = useGetOrdersQuery();
  
  console.log("Orders Data:", ordersData);
  const orders = ordersData?.data || [];
  const isEmpty = orders.length === 0;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "created":
        return <Clock className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isEmpty ? "No orders yet" : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="text-center py-20">
            <Package
              className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6"
              strokeWidth={1}
            />
            <h2 className="text-xl font-light mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
              When you place an order, it will appear here. Start shopping to
              see your order history.
            </p>
            <Button
              asChild
              className="rounded-none px-8 h-11 text-xs tracking-widest uppercase bg-black hover:bg-black/90"
            >
              <Link to="/">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Order Number
                        </p>
                        <p className="font-light">#{order.id}</p>
                      </div>
                      <div className="h-8 w-px bg-gray-200"></div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Date
                        </p>
                        <p className="font-light text-sm">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {getStatusIcon(order.status)}
                      <span className="uppercase tracking-wider text-xs">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  {order.product && (
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-32 bg-gray-100 shrink-0 overflow-hidden">
                        {order.product.img && order.product.img ? (
                          <img
                            src={order.product.img}
                            alt={order.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-light text-base mb-1 truncate">
                          {order.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {order.product.description?.substring(0, 80)}
                          {order.product.description && order.product.description.length > 80 ? "..." : ""}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>{" "}
                            <span className="font-light">{order.quantity}</span>
                          </div>
                          {order.product.price && (
                            <div>
                              <span className="text-muted-foreground">Price:</span>{" "}
                              <span className="font-light">
                                {formatPrice(order.product.price)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Total */}
                      <div className="text-right shrink-0">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Total
                        </p>
                        <p className="text-lg font-light">
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Razorpay Order ID:{" "}
                      <span className="font-mono text-[10px]">
                        {order.razorpayOrderId}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-none h-9 px-6 text-xs tracking-widest uppercase border-black hover:bg-black hover:text-white transition-colors"
                      asChild
                    >
                      <Link to={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;