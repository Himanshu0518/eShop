import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Package, User, CreditCard, MapPin } from "lucide-react";
import type { Order } from "@/types/order.types";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "processing":
    case "created":
      return "outline";
    default:
      return "destructive";
  }
};

const formatStatus = (status: string) => {
  if (status === "paid") return "completed";
  if (status === "created") return "processing";
  return status;
};

export default function OrderDetailDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailDialogProps) {
  if (!order) return null;

  const finalPrice = order.totalPrice;
  const discount = order.product ? (order.product.price * order.product.discount) / 100 : 0;
  const subtotal = finalPrice + discount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: ORD-{order.id.toString().padStart(3, '0')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <Badge variant={getStatusVariant(order.status)} className="capitalize">
              {formatStatus(order.status)}
            </Badge>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar>
                {order.user?.img && <AvatarImage src={order.user.img} />}
                <AvatarFallback>
                  {(order.user?.name || order.user?.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user?.name || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Details
            </h3>
            {order.product ? (
              <div className="flex gap-4 p-3 bg-muted rounded-lg">
                <img
                  src={order.product.img || "/api/placeholder/100/100"}
                  alt={order.product.name}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{order.product.name}</h4>
                  {order.product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {order.product.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {order.product.category.map((cat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Product information not available</p>
            )}
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{order.quantity} item(s)</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {order.product && order.product.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount ({order.product.discount}%)
                  </span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">Razorpay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">{order.razorpayOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={order.status === "paid" ? "default" : "outline"}>
                  {order.status === "paid" ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
