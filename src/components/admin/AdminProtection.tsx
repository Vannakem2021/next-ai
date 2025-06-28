"use client";

// import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSimpleAdminAuth as useAdminAuth } from "@/hooks/useSimpleAdminAuth"; // Temporary fallback
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

interface AdminProtectionProps {
  children: React.ReactNode;
  requiredRole?: "moderator" | "admin" | "super_admin";
  fallback?: React.ReactNode;
}

export default function AdminProtection({
  children,
  requiredRole = "moderator",
  fallback,
}: AdminProtectionProps) {
  const { isLoaded, hasPermission } = useAdminAuth();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [authState, setAuthState] = useState<
    "loading" | "authorized" | "unauthorized" | "unauthenticated"
  >("loading");

  // Enhanced redirect protection
  const redirectAttempted = useRef(false);
  const mountTime = useRef(Date.now());
  const lastRedirectTime = useRef(0);
  const redirectCount = useRef(0);
  const stableAuthTimer = useRef<NodeJS.Timeout | null>(null);
  const authStateHistory = useRef<
    Array<{
      isLoaded: boolean;
      isSignedIn: boolean | undefined;
      timestamp: number;
    }>
  >([]);

  // Enhanced redirect loop detection
  const isRedirectLoop = useCallback(() => {
    const now = Date.now();
    const timeSinceMount = now - mountTime.current;
    const timeSinceLastRedirect = now - lastRedirectTime.current;

    // Don't redirect if we've redirected recently (within 2 seconds)
    if (timeSinceLastRedirect < 2000) {
      return true;
    }

    // Don't redirect if we've had too many redirects
    if (redirectCount.current >= 2) {
      return true;
    }

    // Don't redirect immediately after mount (give auth time to stabilize)
    if (timeSinceMount < 1000) {
      return true;
    }

    return false;
  }, []);

  // Track auth state changes
  useEffect(() => {
    const newState = { isLoaded, isSignedIn, timestamp: Date.now() };
    authStateHistory.current.push(newState);

    // Keep only last 10 states
    if (authStateHistory.current.length > 10) {
      authStateHistory.current.shift();
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    // Clear any existing timer
    if (stableAuthTimer.current) {
      clearTimeout(stableAuthTimer.current);
    }

    if (!isLoaded) {
      setAuthState("loading");
      return;
    }

    // Wait for auth state to stabilize before making decisions
    stableAuthTimer.current = setTimeout(() => {
      if (isSignedIn === false) {
        setAuthState("unauthenticated");

        // Enhanced redirect protection
        const currentPath = window.location.pathname;
        if (
          !redirectAttempted.current &&
          !currentPath.startsWith("/auth") &&
          !isRedirectLoop()
        ) {
          redirectAttempted.current = true;
          lastRedirectTime.current = Date.now();
          redirectCount.current += 1;

          router.replace(`/auth?redirect=${encodeURIComponent(currentPath)}`);
        }
        return;
      }

      if (isSignedIn === true) {
        // Reset redirect protection when user is authenticated
        redirectAttempted.current = false;

        // Check permissions with stable auth state
        const hasRequiredPermission = hasPermission(requiredRole);

        if (hasRequiredPermission) {
          setAuthState("authorized");
        } else {
          setAuthState("unauthorized");
        }
      }
    }, 200); // Small delay to ensure auth state is stable

    return () => {
      if (stableAuthTimer.current) {
        clearTimeout(stableAuthTimer.current);
      }
    };
  }, [
    isLoaded,
    isSignedIn,
    hasPermission,
    requiredRole,
    router,
    isRedirectLoop,
  ]);

  // Render based on auth state
  switch (authState) {
    case "loading":
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl font-space-grotesk">
                A
              </span>
            </div>
            <p className="text-gray-300 font-inter">Loading Admin Panel...</p>
          </div>
        </div>
      );

    case "unauthenticated":
      // Show loading while redirect happens
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl font-space-grotesk">
                A
              </span>
            </div>
            <p className="text-gray-300 font-inter">
              Redirecting to authentication...
            </p>
          </div>
        </div>
      );

    case "unauthorized":
      return (
        fallback || (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl font-space-grotesk">
                  !
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-300 mb-6">
                You need admin privileges to access this page.
                <br />
                <span className="text-sm text-gray-400">
                  Contact your administrator to request access.
                </span>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/app/create")}
                  className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );

    case "authorized":
      return <>{children}</>;

    default:
      return null;
  }
}
