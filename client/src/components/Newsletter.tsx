import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with your actual API call
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Successfully subscribed!", {
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent border-background/30 text-background placeholder:text-background/50 rounded-none h-12 focus:border-background"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-background text-foreground hover:bg-background/90 rounded-none h-12 px-8 text-sm tracking-wider disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="mt-4 text-xs text-background/50">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </section>
  );
}
