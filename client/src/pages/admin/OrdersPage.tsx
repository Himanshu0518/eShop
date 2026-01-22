import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Download, Search } from "lucide-react";
import { useGetAlldBOrdersQuery } from "@/services/order.services";
import OrderDetailDialog from "@/components/admin/OrderDetailDialog";
import type { Order } from "@/types/order.types";
import Spinner from "@/components/Spinner";

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
  if (status === "PAID") return "COMPLETED";
  if (status === "CREATED") return "PROCESSING";
  return status;
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: ordersData, isLoading } = useGetAlldBOrdersQuery();

  const orders = ordersData?.data || [];

  // Filter orders based on search
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const orderId = `ORD-${order.id.toString().padStart(3, '0')}`.toLowerCase();
    const customerName = order.user?.name?.toLowerCase() || "";
    const customerEmail = order.user?.email?.toLowerCase() || "";
    const productName = order.product?.name?.toLowerCase() || "";

    return (
      orderId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower) ||
      productName.includes(searchLower)
    );
  });

  // Calculate stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "PAID").length;
  const processingOrders = orders.filter(o => o.status === "CREATED").length;
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Order ID", "Customer", "Email", "Product", "Quantity", "Amount", "Status", "Date"];
    const rows = orders.map((order) => [
      `ORD-${order.id.toString().padStart(3, '0')}`,
      order.user?.name || "Unknown",
      order.user?.email || "N/A",
      order.product?.name || "N/A",
      order.quantity,
      `$${order.totalPrice.toFixed(2)}`,
      formatStatus(order.status),
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Spinner className="h-8 w-8" />
          <p className="mt-4 text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{completedOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Processing</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{processingOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{pendingOrders}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Order List</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      ORD-{order.id.toString().padStart(3, '0')}
                    </TableCell>
                    <TableCell>
                      {order.user?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.user?.email || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.product?.img && (
                          <img
                            src={order.product.img}
                            alt={order.product.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="truncate max-w-[200px]">
                          {order.product?.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No orders found matching your search." : "No orders found."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
