import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import { useGetAlldBOrdersQuery } from "@/services/order.services";
import { userApi } from "@/services/user.services";
import Spinner from "@/components/Spinner";

export default function Dashboard() {
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAlldBOrdersQuery();
  const { data: usersData, isLoading: usersLoading } = userApi.useGetAllUsersQuery();

  const products = productsData?.data || [];
  const orders = ordersData?.data || [];
  const users = usersData?.data || [];
  
  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // Calculate monthly sales data
  const monthlySalesData = (() => {
    const monthlyData: { [key: string]: { sales: number; orders: number } } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = monthNames[date.getMonth()];
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sales: 0, orders: 0 };
      }
      
      monthlyData[monthKey].sales += order.totalPrice;
      monthlyData[monthKey].orders += 1;
    });

    // Get last 6 months
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = monthNames[monthIndex];
      last6Months.push({
        month: monthName,
        sales: monthlyData[monthName]?.sales || 0,
        orders: monthlyData[monthName]?.orders || 0,
      });
    }

    return last6Months;
  })();

  // Calculate category distribution
  const categoryData = (() => {
    const categoryCount: { [key: string]: number } = {};
    
    products.forEach((product) => {
      product.category.forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    const colors = ["#000000", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];
    
    return Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  })();

  // Get recent orders (last 4)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map((order) => ({
      id: `ORD-${order.id.toString().padStart(3, '0')}`,
      customer: order.user?.name || order.user?.email || "Unknown",
      amount: order.totalPrice,
      status: order.status === "paid" ? "completed" : order.status,
    }));

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingBag,
      description: "vs last month",
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
      description: "vs last month",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: "-2.1%",
      trend: "down" as const,
      icon: Package,
      description: "vs last month",
    },
  ];

  if (productsLoading || ordersLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Spinner className="h-8 w-8" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-light tracking-tight mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales and orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ fill: "#000000" }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#737373"
                  strokeWidth={2}
                  dot={{ fill: "#737373" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue comparison by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from your store</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">${order.amount.toFixed(2)}</p>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "completed" || order.status === "paid"
                          ? "bg-green-50 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
