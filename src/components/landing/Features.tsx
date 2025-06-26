import {
  HiPhotograph,
  HiVideoCamera,
  HiSparkles,
  HiAdjustments,
  HiPlay,
  HiDesktopComputer,
} from "react-icons/hi";
import { HiRectangleStack } from "react-icons/hi2";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-space-grotesk">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Powerful AI Creative Tools
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-inter">
            Unleash your creativity with our comprehensive suite of AI-powered
            generation tools. From images to videos, we&apos;ve got everything
            you need to bring your vision to life.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Generation Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <HiPhotograph className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-space-grotesk">
                Image Generation
              </h3>
            </div>

            <p className="text-gray-300 mb-6 text-lg font-inter">
              Create stunning artwork, illustrations, and photos from simple
              text descriptions. From photorealistic portraits to abstract art.
            </p>

            {/* Sample Image */}
            <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center">
                  <HiPhotograph className="w-16 h-16 text-white/80 mx-auto mb-2" />
                  <p className="text-white/80 text-sm">
                    Sample Generated Image
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Tags */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Text-to-Image
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Style Transfer
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  High Resolution
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Multiple Formats
                </span>
              </div>
            </div>
          </div>

          {/* Video Creation Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-pink-500 transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <HiVideoCamera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white font-space-grotesk">
                Video Creation
              </h3>
            </div>

            <p className="text-gray-300 mb-6 text-lg font-inter">
              Transform static images into dynamic videos or generate entirely
              new video content with AI-powered motion and effects.
            </p>

            {/* Sample Video Preview */}
            <div className="relative w-full h-48 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center">
                  <HiPlay className="w-16 h-16 text-white/80 mx-auto mb-2" />
                  <p className="text-white/80 text-sm">
                    Sample Generated Video
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Tags */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Image-to-Video
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Text-to-Video
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  Motion Control
                </span>
              </div>
              <div className="bg-gray-700/50 rounded-lg px-4 py-2 text-center">
                <span className="text-gray-300 text-sm font-medium">
                  HD Quality
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-gray-800/30 rounded-xl p-6 text-center border border-gray-700 hover:border-blue-500 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2 font-space-grotesk">
              AI Enhancement
            </h4>
            <p className="text-gray-400 text-sm font-inter">
              Automatically enhance and upscale your creations
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 text-center border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HiRectangleStack className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2 font-space-grotesk">
              Batch Processing
            </h4>
            <p className="text-gray-400 text-sm font-inter">
              Generate multiple variations simultaneously
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 text-center border border-gray-700 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HiAdjustments className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2 font-space-grotesk">
              Fine-tuning
            </h4>
            <p className="text-gray-400 text-sm font-inter">
              Precise control over every aspect of generation
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 text-center border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <HiDesktopComputer className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold mb-2 font-space-grotesk">
              API Access
            </h4>
            <p className="text-gray-400 text-sm font-inter">
              Integrate our AI tools into your applications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
