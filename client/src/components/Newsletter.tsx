import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-foreground text-background">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-background/60 text-xs tracking-[0.3em] uppercase">
          Newsletter
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-extralight tracking-tight">
          Stay in the Loop
        </h2>
        <p className="mt-4 text-background/70 font-light">
          Subscribe to receive updates on new arrivals, special offers, and exclusive events.
        </p>

        <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent border-background/30 text-background placeholder:text-background/50 rounded-none h-12 focus:border-background"
          />
          <Button
            type="submit"
            className="bg-background text-foreground hover:bg-background/90 rounded-none h-12 px-8 text-sm tracking-wider"
          >
            Subscribe
          </Button>
        </form>

        <p className="mt-4 text-xs text-background/50">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </section>
  );
}
