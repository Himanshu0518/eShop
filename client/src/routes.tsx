import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layout/RootLayout";
import AuthLayout from "@/layout/AuthLayout";
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
} from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Protected routes (requires authentication)
      {
        element: <AuthLayout authentication={true} />,
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
        path: "new-arrivals",
        element: <NewArrivals />,
      },
    ],
  },

  // Auth routes (public, redirect if already logged in)
  {
    path: "/signup",
    element: <AuthLayout authentication={false} />,
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
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },

  // 404 Fallback
  
]);

export default router;