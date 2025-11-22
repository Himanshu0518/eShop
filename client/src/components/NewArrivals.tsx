import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/services/product.services";
import Spinner from "./Spinner";
// const products = [
//   {
//     id: 1,
//     name: "Linen Blend Shirt",
//     price: 49.99,
//     image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
//     category: "Women",
//   },
//   {
//     id: 2,
//     name: "Cotton Chino Pants",
//     price: 69.99,
//     image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
//     category: "Men",
//   },
//   {
//     id: 3,
//     name: "Oversized Blazer",
//     price: 129.99,
//     image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop",
//     category: "Women",
//   },
//   {
//     id: 4,
//     name: "Minimalist Watch",
//     price: 199.99,
//     image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop",
//     category: "Accessories",
//   },
// ];

export default function NewArrivals() {

  const { data: products, error, isLoading, isSuccess } = useGetProductsQuery();
 
  
  if(isSuccess){
    console.log(products);
  }

  return (
    <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
              Just In
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="group flex items-center gap-2 text-sm tracking-wider hover:gap-3 transition-all duration-300"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
{/* Loading State */}
       {isLoading && (
         <div className="flex items-center justify-center py-20">
           <div className="text-center space-y-4">
             <Spinner />
             <p className="text-sm text-muted-foreground tracking-wider">Loading new arrivals...</p>
           </div>
         </div>
       )}
       
       {/* Error State */}
       {error && (
         <div className="flex items-center justify-center py-20">
           <div className="max-w-md text-center space-y-4 px-6">
             <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
               <svg
                 className="w-6 h-6 text-destructive"
                 fill="none"
                 strokeWidth="2"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
               >
                 <path
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                 />
               </svg>
             </div>
             <div>
               <h3 className="text-lg font-medium mb-2">Unable to load products</h3>
               <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
             </div>
           </div>
         </div>
       )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {isSuccess && products.data.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group">
              <div className="space-y-4">
                {/* Image */}
                <div className="aspect-3/4 overflow-hidden bg-muted">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1">
                  
                  <h3 className="text-sm md:text-base font-normal tracking-wide group-hover:underline underline-offset-4">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
