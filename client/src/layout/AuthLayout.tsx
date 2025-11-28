import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";


interface AuthLayoutProps {
  authentication?: boolean;
}

export default function AuthLayout({ authentication = true }: AuthLayoutProps) {
  return (
    <ProtectedRoute authentication={authentication}>
      <Outlet />
    </ProtectedRoute>
  );
}

interface ProtectedRouteProps {
  authentication?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
  authentication = true,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
  
    const isAuthenticated = currentUser?.data?.token;
    
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
  

}, [ currentUser, authentication, navigate, location]);





  return <>{children}</>;
};