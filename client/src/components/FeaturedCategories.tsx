import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    href: "/category/women",
  },
  {
    name: "Men",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&h=800&fit=crop",
    href: "/category/men",
  },
  {
    name: "Kids",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop",
    href: "/category/kids",
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&h=800&fit=crop",
    href: "/category/accessories",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-18 md:py-30 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
            Collections
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
            Shop by Category
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link to={category.href} key={category.name}>
              <Card className="group relative overflow-hidden border-0 rounded-none cursor-pointer bg-transparent">
                <div className="aspect-3/4 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />

                {/* Category name - always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg md:text-xl font-light tracking-wide drop-shadow-lg">
                      {category.name}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
