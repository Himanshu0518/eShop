import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/user.services";
import Spinner from "@/components/Spinner";
import type { ApiError } from "@/types/user.types";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";
import { User, Shield } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("user");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { error, isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();

      // Check if admin trying to login in user tab or vice versa
      const isAdmin = res.data.isAdmin;
      const loginAsAdmin = activeTab === "admin";

      if (loginAsAdmin && !isAdmin) {
        toast.error("Access Denied", {
          description: "This account does not have admin privileges",
        });
        return;
      }

      toast.success(`Welcome back${isAdmin ? ", Admin" : ""}!`, {
        description: "You have been logged in successfully",
      });

      dispatch(setUser(res));
      localStorage.setItem("token", res.data.token);

      // Redirect based on role
      if (isAdmin && loginAsAdmin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error("Login failed", {
        description:
          err?.data?.message || "Please check your credentials and try again",
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Pre-fill demo credentials based on tab
  const handleDemoFill = () => {
    if (activeTab === "admin") {
      setFormData({
        email: "admin@eshop.com",
        password: "admin123",
      });
      toast.info("Demo admin credentials filled", {
        description: "Click Sign In to login as admin",
      });
    } else {
      setFormData({
        email: "23226@iiitu.ac.in",
        password: "123456",
      });
      toast.info("Demo user credentials filled", {
        description: "Click Sign In to login",
      });
    }
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
          <div className="space-y-6">
            <p className="text-sm font-light opacity-70 max-w-md leading-relaxed">
              Join thousands of fashion enthusiasts who trust eShop for curated
              collections and exclusive designs.
            </p>
            {activeTab === "admin" && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Admin Access</h3>
                    <p className="text-xs opacity-80 leading-relaxed">
                      Secure login for store administrators. Manage products,
                      orders, and users.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="text-3xl font-light tracking-tight">
              eShop
            </Link>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-light tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="user" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Customer</span>
                  <span className="sm:hidden">User</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-5 mt-6">
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
                      required
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
                      required
                    />
                    {error && (error as ApiError)?.data?.errors?.password && (
                      <p className="text-xs text-destructive">
                        {(error as ApiError).data.errors?.password}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={handleDemoFill}
                    >
                      Use demo account
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-none text-xs tracking-widest uppercase font-medium"
                  >
                    {isLoading ? <Spinner className="h-4 w-4" /> : "Sign In"}
                  </Button>

                   {error && (error as ApiError)?.data?.success === false && (
                  <p className="text-xs text-destructive">
                    {(error as ApiError)?.data?.message}
                  </p>
                )}
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-5 mt-6">
                <div className="bg-muted/50 border border-border p-4 rounded text-sm">
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Admin login is for authorized store administrators only.
                      Unauthorized access attempts are logged and monitored.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs tracking-wider uppercase text-muted-foreground"
                    >
                      Admin Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@eshop.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                      required
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
                      Admin Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-11 rounded-none border-border focus:border-foreground transition-colors"
                      required
                    />
                    {error && (error as ApiError)?.data?.errors?.password && (
                      <p className="text-xs text-destructive">
                        {(error as ApiError).data.errors?.password}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="text-xs p-0 h-auto"
                    onClick={handleDemoFill}
                  >
                    Use demo admin account
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-none text-xs tracking-widest uppercase font-medium"
                  >
                    {isLoading ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Sign In as Admin
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

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
