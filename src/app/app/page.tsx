"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AppPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only redirect once Clerk is fully loaded and we haven't redirected yet
    if (isLoaded && !hasRedirected) {
      setHasRedirected(true);

      if (isSignedIn) {
        // User is authenticated, redirect to create page
        router.replace("/app/create");
      } else {
        // User is not authenticated, redirect to auth page
        router.replace("/auth");
      }
    }
  }, [isLoaded, isSignedIn, router, hasRedirected]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-2xl font-space-grotesk">
            AI
          </span>
        </div>
        <p className="text-gray-300 font-inter">
          {!isLoaded ? "Loading..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
