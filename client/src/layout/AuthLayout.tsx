import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  authentication?: boolean;
  requireAdmin?: boolean;
}

export default function AuthLayout({ 
  authentication = true, 
  requireAdmin = false 
}: AuthLayoutProps) {
  return (
    <ProtectedRoute authentication={authentication} requireAdmin={requireAdmin}>
      <Outlet />
    </ProtectedRoute>
  );
}

interface ProtectedRouteProps {
  authentication?: boolean;
  requireAdmin?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
  authentication = true,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const isAuthenticated = currentUser?.data?.token;
    const isAdmin = currentUser?.data?.isAdmin;

    // User should be authenticated but isn't
    if (authentication && !isAuthenticated) {
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
      return;
    }

    // User shouldn't be authenticated but is
    if (!authentication && isAuthenticated) {
      navigate("/", {
        state: { from: location },
        replace: true,
      });
      return;
    }

    // Check admin access
    if (requireAdmin && isAuthenticated && !isAdmin) {
      // User is authenticated but not an admin
      // Show error or redirect
      return;
    }
  }, [currentUser, authentication, requireAdmin, navigate, location]);

  // Check if user needs admin access but doesn't have it
  const isAuthenticated = currentUser?.data?.token;
  const isAdmin = currentUser?.data?.isAdmin;

  if (requireAdmin && isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-light mb-3 tracking-tight">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            You don't have permission to access the admin panel. This area is restricted to administrators only.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="rounded-none h-11 px-8 text-xs tracking-wider uppercase bg-foreground hover:bg-foreground/90"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
