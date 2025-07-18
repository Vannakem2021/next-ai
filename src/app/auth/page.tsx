"use client";

import { useState, useEffect } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isClerkReady, setIsClerkReady] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn } = useSignIn();

  // Enhanced handler functions with redirect validation
  const getValidRedirectUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("redirect");

    // Validate redirect URL to prevent loops
    if (
      !redirectTo ||
      redirectTo === "/auth" ||
      redirectTo.includes("/auth") ||
      !redirectTo.startsWith("/")
    ) {
      console.log(
        "Auth handlers: Using default redirect due to invalid redirect:",
        redirectTo
      );
      return "/app/create";
    }

    console.log("Auth handlers: Using valid redirect:", redirectTo);
    return redirectTo;
  };

  const handleSocialSignIn = async (strategy: "oauth_google") => {
    if (!signIn) return;

    setIsLoading(true);
    try {
      const validRedirectUrl = getValidRedirectUrl();

      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: validRedirectUrl,
        redirectUrlComplete: validRedirectUrl,
      });
    } catch (error) {
      console.error("Social sign in error:", error);
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !signIn) return;

    setIsLoading(true);
    try {
      await signIn.create({
        identifier: email,
      });

      const validRedirectUrl = getValidRedirectUrl();

      // This would typically redirect to a verification page
      // For now, we'll just redirect to the appropriate page
      window.location.href = validRedirectUrl;
    } catch (error) {
      console.error("Email sign in error:", error);
      setIsLoading(false);
    }
  };

  // Wait for Clerk to be fully loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClerkReady(true);
    }, 500); // Give Clerk time to load and render properly

    return () => clearTimeout(timer);
  }, []);

  // Enhanced redirect logic with loop prevention
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Check if there's a redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect");

      console.log("Auth page: User is signed in, processing redirect", {
        redirectTo,
        currentPath: window.location.pathname,
        isLoaded,
        isSignedIn,
        timestamp: Date.now(),
      });

      // Enhanced redirect loop prevention with more checks
      const isInvalidRedirect =
        !redirectTo ||
        redirectTo === "/auth" ||
        redirectTo === window.location.pathname ||
        redirectTo.includes("/auth") ||
        !redirectTo.startsWith("/") ||
        redirectTo.includes("?redirect="); // Prevent nested redirects

      if (isInvalidRedirect) {
        console.log(
          "Auth page: Invalid or circular redirect detected, using default",
          {
            redirectTo,
            reason: "invalid_redirect",
            currentPath: window.location.pathname,
            timestamp: Date.now(),
          }
        );

        // Use a longer delay to ensure auth state is fully stable
        const timer = setTimeout(() => {
          // Triple-check auth state and ensure we're still on auth page
          if (isSignedIn && window.location.pathname.startsWith("/auth")) {
            console.log("Auth page: Redirecting to default app", {
              timestamp: Date.now(),
              currentPath: window.location.pathname,
            });
            window.location.href = "/app/create";
          }
        }, 750); // Increased delay for better stability

        return () => clearTimeout(timer);
      }

      // Valid redirect - add delay to prevent rapid redirects and allow Clerk to settle
      const timer = setTimeout(() => {
        // Triple-check auth state and ensure we're still on auth page before redirecting
        if (isSignedIn && window.location.pathname.startsWith("/auth")) {
          console.log("Auth page: Redirecting to requested page:", {
            redirectTo,
            timestamp: Date.now(),
            currentPath: window.location.pathname,
          });
          window.location.href = redirectTo;
        } else {
          console.log("Auth page: Skipping redirect - conditions not met", {
            isSignedIn,
            currentPath: window.location.pathname,
            timestamp: Date.now(),
          });
        }
      }, 750); // Increased delay for stability

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  // Show loading state until everything is ready
  if (!isLoaded || !isClerkReady || (isLoaded && isSignedIn)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl font-space-grotesk">
              AI
            </span>
          </div>
          <p className="text-gray-300 font-inter">
            {isLoaded && isSignedIn
              ? "Redirecting to your dashboard..."
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl font-space-grotesk">
                AI
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Creative Studio
            </span>
          </h1>
          <p className="text-gray-300 font-inter">
            Sign in to continue creating amazing content
          </p>
        </div>

        {/* Custom Auth Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialSignIn("oauth_google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2 font-inter"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
            >
              {isLoading ? "Loading..." : "Continue →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 font-inter">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors font-inter"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
