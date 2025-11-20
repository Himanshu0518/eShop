
import { createBrowserRouter } from "react-router";
import RootLayout from "@/layout/RootLayout";
import { Home, Cart, Favourite, SignupPage, Contact, Orders, LoginPage } from "@/pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/favourite",
        element: <Favourite />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  }

]);


export default router;
