"use client";

import { useAuth } from "@clerk/nextjs";
import { HiPhotograph, HiVideoCamera, HiCode, HiUser } from "react-icons/hi";

export default function Hero() {
  const { isSignedIn, isLoaded } = useAuth();

  const handleTryForFree = () => {
    // Always wait for Clerk to fully load to avoid timing issues
    if (!isLoaded) {
      // Show a brief loading state instead of opening immediately
      setTimeout(() => {
        if (isSignedIn) {
          window.open("/app/create", "_blank");
        } else {
          window.open("/auth", "_blank");
        }
      }, 100);
      return;
    }

    if (isSignedIn) {
      // If user is already signed in, open /app/create directly in new tab
      window.open("/app/create", "_blank");
    } else {
      // If user is not signed in, open auth page in new tab
      window.open("/auth", "_blank");
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-space-grotesk">
            Create{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Stunning Visuals
            </span>{" "}
            with
            <br />
            AI Magic
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-inter">
            Transform your ideas into breathtaking images and videos with our
            cutting-edge AI platform. No design skills required – just pure
            creativity unleashed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleTryForFree}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try for Free
            </button>
            <button className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-200 border border-gray-600">
              Watch Demo
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Digital Art Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <HiPhotograph className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Digital Art
              </h3>
              <p className="text-gray-400 text-sm font-inter">
                Create stunning digital artwork from simple text descriptions
              </p>
            </div>

            {/* Video Generation Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-full h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <HiVideoCamera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Video Magic
              </h3>
              <p className="text-gray-400 text-sm font-inter">
                Transform static images into dynamic, engaging video content
              </p>
            </div>

            {/* Code Visualization Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-full h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <HiCode className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Code to Visual
              </h3>
              <p className="text-gray-400 text-sm font-inter">
                Convert code snippets into beautiful visual representations
              </p>
            </div>

            {/* AI Portraits Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <div className="w-full h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <HiUser className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                AI Portraits
              </h3>
              <p className="text-gray-400 text-sm font-inter">
                Generate professional portraits and character designs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
