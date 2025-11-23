import React, { useEffect } from "react";
import { useCurrentUserQuery } from "@/services/user.services";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/Spinner";

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
  const { data: currentUser, isLoading, isError, isSuccess } = useCurrentUserQuery();

  useEffect(() => {
    if (isSuccess) {
      // User is authenticated
      if (authentication && !currentUser?.data.token) {
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
        return;
      }

      // User is NOT authenticated (trying to access public route)
      if (!authentication && currentUser?.data.token) {
        navigate("/", {
          state: { from: location },
          replace: true,
        });
        return;
      }
    }

    if (isError) {
      // If authentication is required and there's an error, redirect to login
      if (authentication) {
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    }
  }, [isSuccess, isError, currentUser, authentication, navigate, location]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Spinner />
          <p className="mt-6 text-sm font-light text-gray-600 tracking-wider">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Error state for protected routes
  if (isError && authentication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-6"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-xl font-light text-black mb-2">
            Unable to verify authentication
          </h1>
          <p className="text-sm font-light text-gray-600 mb-8">
            Please try logging in again
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full h-11 bg-black text-white hover:bg-gray-900 rounded-none text-xs font-light tracking-widest uppercase transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};