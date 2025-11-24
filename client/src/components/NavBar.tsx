import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetCartQuery } from "@/services/cart.services";
import { useGetFavoritesQuery } from "@/services/favourites.services";

const NavItems = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
  { name: "Orders", path: "/orders" },
];

function NavBar() {
  const location = useLocation();
  const { data: cartData } = useGetCartQuery();
  const { data: favoritesData } = useGetFavoritesQuery();
  
  const cartItemsCount = cartData?.data?.length || 0;
  const favoritesCount = favoritesData?.data?.length || 0;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">
          {/* Left - Mobile Menu & Logo / Desktop Nav */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <MobileNavBar 
                cartCount={cartItemsCount} 
                favoritesCount={favoritesCount} 
              />
            </div>

            {/* Logo - Left on Mobile, after menu on Desktop */}
            <Link
              to="/"
              className="text-xl md:text-2xl font-semibold tracking-tight"
            >
              eShop
            </Link>

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

          {/* Right - Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              className="p-2.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              to="/favourite"
              className="p-2.5 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 bg-foreground text-background text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-2.5 rounded-full hover:bg-muted transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-foreground text-background text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            <div className="ml-1 hidden sm:block">
              <ProfileAvatar />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

export function MobileNavBar({ cartCount, favoritesCount }: { cartCount: number; favoritesCount: number }) {
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
        <div className="p-6 border-b border-border flex items-center justify-between">
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
            to="/favourite"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
          >
            <span>Wishlist</span>
            {favoritesCount > 0 && (
              <span className="bg-muted text-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
          >
            <span>Shopping Bag</span>
            {cartCount > 0 && (
              <span className="bg-muted text-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Profile Section */}
        <div className="border-t border-border">
          <div className="p-6">
            <ProfileAvatar />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}