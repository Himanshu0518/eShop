import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/user.services";
import Spinner from "@/components/Spinner";
import type { ApiError } from "@/types/user.types";
import { toast } from "sonner";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { error, isLoading }] = useLoginMutation();

 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
       toast.success("You are logged in successfully!");
      await login(formData).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);

    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/AuthImage.png"
            alt="Login Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to="/" className="text-4xl font-light tracking-tight">
              eShop
            </Link>
            <p className="mt-2 text-base font-light opacity-80">
              Elevate your style
            </p>
          </div>
          <div>
            <p className="text-sm font-light opacity-70 max-w-md leading-relaxed">
              Join thousands of fashion enthusiasts who trust eShop for curated
              collections and exclusive designs.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="text-3xl font-light tracking-tight">
              eShop
            </Link>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                />
                {error && (error as ApiError)?.data?.errors?.email && (
                  <p className="text-xs text-destructive">
                    {(error as ApiError)?.data?.errors?.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                />
                {error && (error as ApiError)?.data?.errors?.password && (
                  <p className="text-xs text-destructive">
                    {(error as ApiError).data.errors?.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-none text-xs tracking-widest uppercase font-medium"
              >
                {isLoading ? <Spinner className="h-4 w-4" /> : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground tracking-wider">
                  Or
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-foreground font-medium hover:underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
