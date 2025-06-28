"use client";

import { HiCheck, HiStar } from "react-icons/hi";
import { useAuth } from "@clerk/nextjs";

export default function Pricing() {
  const { isSignedIn, isLoaded } = useAuth();

  const handleGetStarted = () => {
    // Wait for Clerk to load before making auth decisions
    if (!isLoaded) {
      // If Clerk is still loading, open auth page to be safe
      window.open("/auth", "_blank");
      return;
    }

    if (isSignedIn) {
      // If user is already signed in, open /app/create in new tab
      window.open("/app/create", "_blank");
    } else {
      // If user is not signed in, open auth page in new tab
      // After auth, user will be redirected to /app/create
      window.open("/auth", "_blank");
    }
  };
  return (
    <section id="pricing" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-space-grotesk">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Simple, Credit-Based Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-inter">
            Pay only for what you create. Our flexible credit system lets you
            generate amazing content without worrying about complex
            subscriptions or hidden fees.
          </p>
        </div>

        {/* How Credits Work */}
        <div className="bg-gray-700/50 rounded-2xl p-8 mb-12 border border-gray-600">
          <h3 className="text-2xl font-bold text-white text-center mb-8 font-space-grotesk">
            How Credits Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white font-space-grotesk">
                  1
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Credit = 1 Image
              </h4>
              <p className="text-gray-300 text-sm font-inter">
                Generate one high-quality image
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white font-space-grotesk">
                  5
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Credits = 1 Video (15s)
              </h4>
              <p className="text-gray-300 text-sm font-inter">
                Create short video content
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white font-space-grotesk">
                  2
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
                Credits = Style Transfer
              </h4>
              <p className="text-gray-300 text-sm font-inter">
                Transform existing images
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Pack */}
          <div className="bg-gray-700/50 rounded-2xl p-8 border border-gray-600 hover:border-purple-500 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                Starter Pack
              </h3>
              <div className="text-4xl font-bold text-white mb-2 font-space-grotesk">
                $9.99
              </div>
              <p className="text-gray-300 font-inter">100 Credits</p>
              <p className="text-sm text-gray-400 font-inter">
                $0.10 per credit
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  100 Image generations
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  20 Video generations (15s)
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  50 Style transfers
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  Credits never expire
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  High-resolution outputs
                </span>
              </li>
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-inter"
            >
              Get Started
            </button>
          </div>

          {/* Pro Pack - Most Popular */}
          <div className="bg-gray-700/50 rounded-2xl p-8 border-2 border-purple-500 hover:border-purple-400 transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center font-inter">
                <HiStar className="w-4 h-4 mr-1" />
                Most Popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                Pro Pack
              </h3>
              <div className="text-4xl font-bold text-white mb-2 font-space-grotesk">
                $39.99
              </div>
              <p className="text-gray-300 font-inter">500 Credits</p>
              <p className="text-sm text-gray-400 font-inter">
                $0.08 per credit
              </p>
              <div className="text-sm text-green-400 font-semibold font-inter">
                Save 20%
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  500 Image generations
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  100 Video generations (15s)
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  250 Style transfers
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  Priority processing
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  API access included
                </span>
              </li>
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-inter"
            >
              Choose Pro
            </button>
          </div>

          {/* Enterprise Pack */}
          <div className="bg-gray-700/50 rounded-2xl p-8 border border-gray-600 hover:border-purple-500 transition-all duration-300">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">
                Enterprise
              </h3>
              <div className="text-4xl font-bold text-white mb-2 font-space-grotesk">
                $149.99
              </div>
              <p className="text-gray-300 font-inter">2,500 Credits</p>
              <p className="text-sm text-gray-400 font-inter">
                $0.06 per credit
              </p>
              <div className="text-sm text-green-400 font-semibold font-inter">
                Save 40%
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  2,500 Image generations
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  500 Video generations (15s)
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  1,250 Style transfers
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  Dedicated support
                </span>
              </li>
              <li className="flex items-center">
                <HiCheck className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300 font-inter">
                  Custom integrations
                </span>
              </li>
            </ul>

            <button
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-inter"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg font-inter">
            All plans include secure cloud storage, high-resolution downloads,
            and commercial usage rights.
          </p>
          <p className="text-gray-500 text-sm mt-2 font-inter">
            Credits never expire • No monthly commitments • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
