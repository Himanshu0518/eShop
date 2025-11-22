import { Truck, RefreshCw, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-20 px-6 md:px-16 lg:px-24 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <feature.icon className="h-6 w-6 mx-auto mb-4 text-foreground" strokeWidth={1.5} />
              <h3 className="text-sm font-medium tracking-wide mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
