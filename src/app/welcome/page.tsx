"use client";

import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { HiExternalLink, HiArrowRight } from "react-icons/hi";

export default function WelcomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to auth page, but avoid infinite loops
      window.location.href = "/auth";
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl font-space-grotesk">
              AI
            </span>
          </div>
          <p className="text-gray-300 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-space-grotesk">
                  AI
                </span>
              </div>
              <span className="ml-2 text-xl font-bold text-white font-space-grotesk">
                Creative Studio
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-inter">
                Welcome, {user?.firstName || "Creator"}!
              </span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-gray-800 border-gray-700",
                    userButtonPopoverActionButton:
                      "text-gray-300 hover:text-white hover:bg-gray-700",
                    userButtonPopoverActionButtonText: "font-inter",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
                afterSignOutUrl="/auth"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-4xl">✓</span>
          </div>

          {/* Welcome Message */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-space-grotesk">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              AI Creative Studio
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-inter">
            🎉 Congratulations! Your account is ready. You now have access to
            powerful AI tools for creating stunning images and videos.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => (window.location.href = "/app")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center font-inter"
            >
              <HiArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>

            <button
              onClick={() => window.open("/app", "_blank")}
              className="bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-all duration-200 border border-gray-600 flex items-center font-inter"
            >
              <HiExternalLink className="w-5 h-5 mr-2" />
              Open in New Tab
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-2 font-space-grotesk">
                Free Credits
              </h3>
              <p className="text-3xl font-bold text-purple-400 mb-2 font-space-grotesk">
                10
              </p>
              <p className="text-gray-400 text-sm font-inter">Ready to use</p>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-2 font-space-grotesk">
                AI Models
              </h3>
              <p className="text-3xl font-bold text-pink-400 mb-2 font-space-grotesk">
                5+
              </p>
              <p className="text-gray-400 text-sm font-inter">Available now</p>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-2 font-space-grotesk">
                Support
              </h3>
              <p className="text-3xl font-bold text-green-400 mb-2 font-space-grotesk">
                24/7
              </p>
              <p className="text-gray-400 text-sm font-inter">Always here</p>
            </div>
          </div>

          {/* Back to Landing */}
          <div className="mt-12">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-gray-400 hover:text-white transition-colors font-inter"
            >
              ← Back to Landing Page
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
