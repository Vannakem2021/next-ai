import { HiHeart } from 'react-icons/hi';
import { FaTwitter, FaLinkedin, FaYoutube, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      {/* Newsletter Section */}
      <div className="bg-gray-700/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Stay Creative
            </span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto font-inter">
            Get the latest AI art trends, feature updates, and creative inspiration delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
            />
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-inter">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm font-space-grotesk">AI</span>
                </div>
                <span className="text-xl font-bold text-white font-space-grotesk">Creative Studio</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md font-inter">
                Empowering creators worldwide with cutting-edge AI technology to bring imagination to life.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-200">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-200">
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-200">
                  <FaYoutube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all duration-200">
                  <FaDiscord className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 font-space-grotesk">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">API Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Examples</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Changelog</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 font-space-grotesk">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Press Kit</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Partners</a></li>
              </ul>
            </div>

            {/* Resources & Legal Combined */}
            <div>
              <h3 className="text-white font-semibold mb-4 font-space-grotesk">Resources</h3>
              <ul className="space-y-3 mb-6">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Templates</a></li>
              </ul>
              
              <h3 className="text-white font-semibold mb-4 font-space-grotesk">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">GDPR</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-inter">Licensing</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h4 className="text-white font-semibold mb-4 font-space-grotesk">Trusted by creators worldwide</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm font-inter">
              <span className="bg-gray-700/50 px-4 py-2 rounded-lg">SOC 2 Compliant</span>
              <span className="bg-gray-700/50 px-4 py-2 rounded-lg">GDPR Ready</span>
              <span className="bg-gray-700/50 px-4 py-2 rounded-lg">99.9% Uptime</span>
              <span className="bg-gray-700/50 px-4 py-2 rounded-lg">ISO 27001</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-inter">
              © 2024 AI Creative Studio. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center font-inter">
              Made with <HiHeart className="w-4 h-4 text-red-500 mx-1" /> for the creative community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
