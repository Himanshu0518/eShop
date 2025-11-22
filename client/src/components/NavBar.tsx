import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu } from "lucide-react";
import { ModeToggle } from "@/components/ThemeToggleMode";
import ProfileAvatar from "./ProfileAvatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavItems = [
  { name: "Home", path: "/" },
  {name:"contact",path:"/contact"},
  {name:"orders",path:"/orders"},
  //{name:"about",path:"/about"},
];

function NavBar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Left - Mobile Menu & Desktop Nav */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <MobileNavBar />
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-8">
              {NavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-semibold tracking-tight"
          >
            eShop
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <ModeToggle />

            <button
              className="p-2.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              to="/favourite"
              className="p-2.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
            </Link>

            <Link
              to="/cart"
              className="p-2.5 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 bg-foreground text-background text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Link>

            <div className="ml-1"><ProfileAvatar /></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

export function MobileNavBar() {
  const location = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <SheetTitle className="text-xl font-semibold tracking-tight">
            eShop
          </SheetTitle>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-4">
          {NavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-6 py-4 text-sm tracking-wide transition-colors ${
                location.pathname === item.path
                  ? "text-foreground font-medium bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-border mx-6" />

        {/* Secondary Links */}
        <nav className="flex flex-col py-4">
          <Link
            to="/orders"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            My Orders
          </Link>
          <Link
            to="/favourite"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Wishlist
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In / Register
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
