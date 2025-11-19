import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { MdFavorite, MdMenu } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ThemeToggleMode";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileNavBar />
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
          >
            eShop
          </Link>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {NavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsActive(item.name)}
                className={`
    relative px-3 py-2 font-medium transition-all duration-200 
    ${
      isActive === item.name
        ? "text-primary" // active text color
        : "text-muted-foreground hover:text-foreground"
    }
    hover:bg-accent/10 rounded-md
  `}
              >
                {item.name}

                {isActive === item.name && (
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <ModeToggle />

            <button
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 relative"
              aria-label="Favourites"
            >
              <MdFavorite className="text-xl" />
            </button>

            <button
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 relative"
              aria-label="Cart"
            >
              <FaShoppingCart className="text-lg" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            <Avatar className="h-9 w-9 border-2 border-border hover:border-primary transition-colors duration-200 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                CN
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;


export function MobileNavBar() {
  const [isActive, setIsActive] = useState<string>("Home");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
          aria-label="Menu"
        >
          <MdMenu className="text-2xl" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        {/* Header */}
        <div className="p-5 border-b border-border">
          <SheetTitle className="text-2xl font-bold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            eShop
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Your one-stop online store
          </SheetDescription>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4">
          {NavItems.map((item) => {
            const active = isActive === item.name;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsActive(item.name)}
                className={`
                  relative px-5 py-3 text-base font-medium transition-all
                  ${active 
                    ? "text-primary bg-accent/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  }
                `}
              >
                {/* Active left bar indicator */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-md"></span>
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
