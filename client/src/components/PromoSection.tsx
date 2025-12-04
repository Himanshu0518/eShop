

export default function PromoSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Promo Card 1 */}
          <div className="relative h-[60vh] md:h-[70vh] overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop"
              alt="Summer Sale"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <span className="text-white/80 text-xs tracking-[0.3em] uppercase mb-3">
                Limited Time
              </span>
              <h3 className="text-white text-3xl md:text-4xl font-extralight tracking-tight mb-4">
                Summer Sale
                <span className="block font-normal">Up to 50% Off</span>
              </h3>
            
            </div>
          </div>

          {/* Promo Card 2 */}
          <div className="relative h-[60vh] md:h-[70vh] overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop"
              alt="New Season"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <span className="text-white/80 text-xs tracking-[0.3em] uppercase mb-3">
                New Season
              </span>
              <h3 className="text-white text-3xl md:text-4xl font-extralight tracking-tight mb-4">
                Fall Collection
                <span className="block font-normal">Now Available</span>
              </h3>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
