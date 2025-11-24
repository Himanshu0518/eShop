import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "@/services/user.services";
import Spinner from "@/components/Spinner";
import type { ApiError } from "@/types/user.types";
import { toast } from "sonner";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signUp, { error, isLoading, isSuccess }] = useSignUpMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
      toast.success("Account created successfully!");
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signUp(formData);
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
            alt="Signup Background"
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
              <h2 className="text-2xl font-light tracking-tight">Create Account</h2>
              <p className="text-sm text-muted-foreground">
                Start your journey with us today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                />
                {error && (error as ApiError)?.data?.errors?.name && (
                  <p className="text-xs text-destructive">
                    {(error as ApiError).data.errors?.name}
                  </p>
                )}
              </div>

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
                    {(error as ApiError)?.data.errors?.email}
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
                    {(error as ApiError)?.data.errors?.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs tracking-wider uppercase text-muted-foreground"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                />
                {error && (error as ApiError)?.data?.errors?.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {(error as ApiError)?.data.errors?.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-none text-xs tracking-widest uppercase font-medium"
              >
                {isLoading ? <Spinner className="h-4 w-4" /> : "Create Account"}
              </Button>

              {error && (error as ApiError)?.data?.message && (
                <p className="text-xs text-destructive text-center">
                  {(error as ApiError).data.message}
                </p>
              )}
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-foreground font-medium hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
