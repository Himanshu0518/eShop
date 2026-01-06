import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "@/services/order.services";
import { useAppSelector } from "@/store/authSlice";
import { skipToken } from "@reduxjs/toolkit/query";

function Orders() {
  const authStatus=useAppSelector((state) => state.auth.status);

  const { data: ordersData, isLoading, isError } = useGetOrdersQuery(
    authStatus ? undefined : skipToken
  );
  
  const orders = ordersData?.data || [];
  const isEmpty = orders.length === 0;
  
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "paid":
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          label: "Confirmed",
          color: "text-green-700 bg-green-50 border-green-200"
        };
      case "created":
      case "pending":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Pending",
          color: "text-amber-700 bg-amber-50 border-amber-200"
        };
      case "shipped":
      case "in transit":
        return {
          icon: <Truck className="h-4 w-4" />,
          label: "Shipped",
          color: "text-blue-700 bg-blue-50 border-blue-200"
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: "Cancelled",
          color: "text-red-700 bg-red-50 border-red-200"
        };
      default:
        return {
          icon: <Package className="h-4 w-4" />,
          label: status,
          color: "text-gray-700 bg-gray-50 border-gray-200"
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded-none w-48"></div>
              <div className="h-4 bg-muted rounded-none w-32"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border">
                  <div className="h-24 bg-muted/30"></div>
                  <div className="h-40 bg-background"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-destructive" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-light mb-3">Unable to Load Orders</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              We couldn't fetch your orders. Please check your connection and try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="rounded-none h-11 px-8 text-xs tracking-wider uppercase border-foreground hover:bg-foreground hover:text-background"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-3">
            Order History
          </h1>
          <p className="text-sm text-muted-foreground tracking-wide">
            {isEmpty 
              ? "You haven't placed any orders yet" 
              : `${orders.length} ${orders.length === 1 ? "order" : "orders"} in total`
            }
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="text-center py-20 md:py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mb-8">
              <Package
                className="h-10 w-10 text-muted-foreground/60"
                strokeWidth={1}
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-extralight tracking-tight mb-4">
              No Orders Yet
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Start exploring our collection and place your first order. 
              All your purchases will appear here for easy tracking.
            </p>
            <Button
              asChild
              className="rounded-none h-12 px-10 text-xs tracking-widest uppercase bg-foreground hover:bg-foreground/90 text-background"
            >
              <Link to="/">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6 md:space-y-8">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              
              return (
                <div
                  key={order.id}
                  className="border border-border hover:border-foreground/30 transition-colors duration-300 bg-background"
                >
                  {/* Order Header */}
                  <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/20">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                            Order
                          </p>
                          <p className="font-light text-sm">#{order.id}</p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-border"></div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                            Placed On
                          </p>
                          <p className="font-light text-sm">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-border"></div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                            Total Amount
                          </p>
                          <p className="font-normal text-sm">
                            {formatPrice(order.totalPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Order Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-none text-xs tracking-wider uppercase ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="font-medium">{statusConfig.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 md:p-8">
                    {order.product && (
                      <div className="flex gap-6 md:gap-8">
                        {/* Product Image */}
                        <Link 
                          to={`/product/${order.product.id}`}
                          className="group shrink-0"
                        >
                          <div className="w-24 h-32 md:w-28 md:h-36 bg-muted overflow-hidden">
                            {order.product.img ? (
                              <img
                                src={order.product.img}
                                alt={order.product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${order.product.id}`}
                            className="block group"
                          >
                            <h3 className="font-light text-base md:text-lg mb-2 group-hover:text-muted-foreground transition-colors">
                              {order.product.name}
                            </h3>
                          </Link>
                          
                          {order.product.description && (
                            <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-2 leading-relaxed">
                              {order.product.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Qty</span>
                              <span className="font-light">{order.quantity}</span>
                            </div>
                            {order.product.price && (
                              <div className="flex items-baseline gap-2">
                                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Unit Price</span>
                                <span className="font-light">
                                  {formatPrice(order.product.price)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-muted-foreground/70">
                        <span className="uppercase tracking-wider text-[10px]">Payment ID:</span>{" "}
                        <span className="font-mono text-[10px] ml-1">
                          {order.razorpayOrderId}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="rounded-none h-10 px-6 text-[11px] tracking-widest uppercase border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                          asChild
                        >
                          <Link to={`/product/${order.product?.id}`}>
                            View Product
                          </Link>
                        </Button>
                        <Button
                          className="rounded-none h-10 px-6 text-[11px] tracking-widest uppercase bg-foreground hover:bg-foreground/90 text-background"
                          asChild
                        >
                          <Link to={`/orders/${order.id}`}>
                            Order Details
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        {!isEmpty && (
          <div className="mt-16 pt-12 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help with your order?
            </p>
            <Button
              variant="ghost"
              className="rounded-none h-10 px-6 text-xs tracking-widest uppercase hover:bg-muted"
              asChild
            >
              <Link to="/contact">
                Contact Support
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
