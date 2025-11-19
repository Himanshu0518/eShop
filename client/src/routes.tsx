
import { createBrowserRouter } from "react-router";
import RootLayout from "@/layout/RootLayout";
import Home from "@/pages/Home";
import Cart from "@/pages/Cart";
import Favourite from "@/pages/Favourite";

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
        element: <h1>Contact</h1>,
      },
      {
        path: "/orders",
        element: <h1>Orders</h1>,
      },
    ],
  },

]);


export default router;
