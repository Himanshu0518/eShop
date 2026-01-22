import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layout/RootLayout";
import AuthLayout from "@/layout/AuthLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  Home,
  Cart,
  Favourite,
  SignupPage,
  Contact,
  Orders,
  LoginPage,
  Men,
  Women,
  Kids,
  Accessories,
  NewArrivals,
  Product,
  About,
  OrderedProduct,
} from "@/pages";

// Admin imports
import {
  AdminLayout,
  Dashboard,
  ProductsPage,
  OrdersPage,
  UsersPage,
} from "@/pages/admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Protected routes (requires authentication)
      {
        element: <AuthLayout authentication={true} />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "favourite",
            element: <Favourite />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "orders/:orderId",
            element: <OrderedProduct />,
          },
        ],
      },

      // Public routes (no authentication required)
      {
        index: true,
        element: <Home />,
      },
      {
        path: "category/men",
        element: <Men />,
      },
      {
        path: "category/women",
        element: <Women />,
      },
      {
        path: "category/kids",
        element: <Kids />,
      },
      {
        path: "category/accessories",
        element: <Accessories />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "new-arrivals",
        element: <NewArrivals />,
      },
      {
        path: "products",
        element: <NewArrivals />,
      },
      {
        path: "product/:productId",
        element: <Product />,
      },
    ],
  },

  // Admin routes (requires authentication AND admin role)
  {
    path: "/admin",
    element: <AuthLayout authentication={true} requireAdmin={true} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <ProductsPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },

        ],
      },
    ],
  },

  // Auth routes (public, redirect if already logged in)
  {
    path: "/signup",
    element: <AuthLayout authentication={false} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <SignupPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout authentication={false} />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;
