import { useVerifyPaymentMutation, useGetOrdersQuery } from "@/services/order.services";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppSelector } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  MapPin, 
  CreditCard,
  AlertCircle,
  ShoppingBag
} from "lucide-react";

const OrderedProduct = () => {
  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const { data: ordersData, isLoading, isError } = useGetOrdersQuery();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = ordersData?.data?.find((order) => order.id === Number(orderId));

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "paid":
      case "completed":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          label: "Confirmed",
          color: "text-green-700 bg-green-50 border-green-200",
          description: "Your order has been confirmed and is being prepared for shipment."
        };
      case "created":
      case "pending":
        return {
          icon: <Clock className="h-5 w-5" />,
          label: "Processing",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          description: "We're processing your order. Payment verification pending."
        };
      case "shipped":
      case "in transit":
        return {
          icon: <Truck className="h-5 w-5" />,
          label: "Shipped",
          color: "text-blue-700 bg-blue-50 border-blue-200",
          description: "Your order is on its way to you."
        };
      case "cancelled":
        return {
          icon: <XCircle className="h-5 w-5" />,
          label: "Cancelled",
          color: "text-red-700 bg-red-50 border-red-200",
          description: "This order has been cancelled."
        };
      default:
        return {
          icon: <Package className="h-5 w-5" />,
          label: status,
          color: "text-gray-700 bg-gray-50 border-gray-200",
          description: "Order status information unavailable."
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleVerifyPayment = async () => {
    if (!order) return;

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.totalPrice * 100, // Convert to paise/cents
        currency: "INR",
        name: "eShop",
        description: `Order #${order.id}`,
        order_id: order.razorpayOrderId,

        handler: async function (response: any) {
          try {
            const res = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (res.success) {
              toast.success("Payment verified successfully", {
                description: "Your order is now confirmed."
              });
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed", {
              description: "Please try again or contact support."
            });
          }
        },

        prefill: {
          name: user?.data.name,
          email: user?.data.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.error("Payment failed:", err);
      toast.error("Unable to process payment", {
        description: "Please try again later."
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded-none w-48"></div>
            <div className="border border-border p-8 space-y-6">
              <div className="h-32 bg-muted rounded-none"></div>
              <div className="h-48 bg-muted rounded-none"></div>
              <div className="h-24 bg-muted rounded-none"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !order) {
    return (
      <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-light mb-3">Order Not Found</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              We couldn't find the order you're looking for. It may have been removed or the link is incorrect.
            </p>
            <Button
              onClick={() => navigate("/orders")}
              variant="outline"
              className="rounded-none h-11 px-8 text-xs tracking-wider uppercase border-foreground hover:bg-foreground hover:text-background"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const isPending = order.status.toLowerCase() === "created" || order.status.toLowerCase() === "pending";

  return (
    <div className="min-h-[70vh] px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/orders")}
          variant="ghost"
          className="mb-8 -ml-4 rounded-none hover:bg-transparent hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-xs tracking-wider uppercase">Back to Orders</span>
        </Button>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight mb-3">
            Order Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Order #{order.id} • Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
          </p>
        </div>

        {/* Payment Pending Alert */}
        {isPending && (
          <div className="mb-8 border border-amber-200 bg-amber-50/50 p-6 flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900 mb-1">Payment Verification Pending</h3>
              <p className="text-sm text-amber-800/80 mb-4">
                Your order is awaiting payment confirmation. Complete the payment to confirm your order.
              </p>
              <Button
                onClick={handleVerifyPayment}
                disabled={isVerifying}
                className="rounded-none h-10 px-6 text-xs tracking-widest uppercase bg-amber-700 hover:bg-amber-800 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isVerifying ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          </div>
        )}

        {/* Order Status */}
        <div className="border border-border mb-8">
          <div className="px-6 md:px-8 py-6 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2 font-medium">
                  Order Status
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-none text-xs tracking-wider uppercase ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span className="font-medium">{statusConfig.label}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 md:px-8 py-5">
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              {statusConfig.description}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="border border-border mb-8">
          <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm uppercase tracking-[0.15em] font-medium">
                Order Items
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {order.product && (
              <div className="flex gap-6 md:gap-8">
                {/* Product Image */}
                <Link 
                  to={`/product/${order.product.id}`}
                  className="group shrink-0"
                >
                  <div className="w-32 h-44 md:w-40 md:h-52 bg-muted overflow-hidden">
                    {order.product.img ? (
                      <img
                        src={order.product.img}
                        alt={order.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${order.product.id}`}
                    className="block group"
                  >
                    <h3 className="font-light text-lg md:text-xl mb-3 group-hover:text-muted-foreground transition-colors">
                      {order.product.name}
                    </h3>
                  </Link>

                  {order.product.description && (
                    <p className="text-sm text-muted-foreground/80 mb-6 leading-relaxed">
                      {order.product.description}
                    </p>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Unit Price</span>
                      <span className="font-light">{formatPrice(order.product.price)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-light">× {order.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 text-base">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-normal">{formatPrice(order.product.price * order.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-border mb-8">
          <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/20">
            <h2 className="text-sm uppercase tracking-[0.15em] font-medium">
              Order Summary
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-light">{formatPrice(order.totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-light text-green-600">Free</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-light">Included</span>
            </div>
            <div className="h-px bg-border my-4"></div>
            <div className="flex items-center justify-between py-2">
              <span className="text-base font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-normal">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="border border-border mb-8">
          <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm uppercase tracking-[0.15em] font-medium">
                Payment Information
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-start justify-between py-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                  Payment Method
                </p>
                <p className="text-sm font-light">Razorpay</p>
              </div>
            </div>
            
            <div className="flex items-start justify-between py-2">
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                  Payment ID
                </p>
                <p className="text-xs font-mono text-muted-foreground/70 break-all">
                  {order.razorpayOrderId}
                </p>
              </div>
            </div>

            {isPending && (
              <div className="pt-4 border-t border-border/50">
                <Button
                  onClick={handleVerifyPayment}
                  disabled={isVerifying}
                  className="w-full rounded-none h-12 text-xs tracking-widest uppercase bg-foreground hover:bg-foreground/90"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isVerifying ? "Processing Payment..." : "Verify Payment Now"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="border border-border">
          <div className="px-6 md:px-8 py-5 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm uppercase tracking-[0.15em] font-medium">
                Delivery Information
              </h2>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                  Recipient
                </p>
                <p className="text-sm font-light">{user?.data.name}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                  Email
                </p>
                <p className="text-sm font-light">{user?.data.email}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5 font-medium">
                  Estimated Delivery
                </p>
                <p className="text-sm font-light text-muted-foreground/80">
                  5-7 business days from order confirmation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Questions about your order?
          </p>
          <Button
            variant="ghost"
            className="rounded-none h-10 px-6 text-xs tracking-widest uppercase hover:bg-muted"
            asChild
          >
            <Link to="/contact">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderedProduct;
