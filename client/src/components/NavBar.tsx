import { Link } from "react-router-dom";
import { FaSearch,FaShoppingCart } from "react-icons/fa";
import { MdFavorite ,  MdMenu } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {ModeToggle} from "@/components/ThemeToggleMode"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useState } from "react";
const NavItems = [
  { name: "Home", path: "/" },
  { name: "Favourite", path: "/favourite" },
  { name: "Cart", path: "/cart" },
  { name: "Orders", path: "/orders" },
  { name: "Contact", path: "/contact" },
];

function NavBar() {
    
    const [isActive, setIsActive] = useState<string>("Home");
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">

        {/* Mobile Nav  */}
        <div className="md:hidden">
            <MobileNavBar />
        </div>

      {/* Logo */}
      <div className="text-2xl font-bold">eShop</div>
      {/* Nav Items */}
      <div className="flex space-x-4">
        {NavItems.map((item) => (
          <Link key={item.name} 
          to={item.path} 
          onClick ={() => setIsActive(item.name)}
          className={`hover:text-gray-400 hidden md:inline-block ${isActive === item.name ? "text-yellow-300" : ""}`}>
            {item.name}
          </Link>
        ))}
      </div>

      {/* profile */}

      <div className="flex items-center space-x-2">
        <ModeToggle />
        <FaSearch className="text-xl cursor-pointer" />
        <MdFavorite className="text-xl cursor-pointer" />
        <FaShoppingCart className="text-xl cursor-pointer" />
        <Avatar
        >
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default NavBar;



export function MobileNavBar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
       <MdMenu className="text-3xl cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
            <SheetHeader>
                <SheetTitle>eShop</SheetTitle>
                <SheetDescription>
                    Welcome to eShop mobile navigation
                </SheetDescription>
            </SheetHeader>
        </SheetContent>
    </Sheet>
  )
}