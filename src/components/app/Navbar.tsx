"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiSparkles,
  HiMenu,
  HiOutlineViewGrid,
  HiChevronDown,
  HiOutlineCog,
  HiChevronRight,
} from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface NavbarProps {
  onGenerate: (
    prompt: string,
    aspectRatio: string,
    batchSize: number,
    advancedSettings?: {
      steps: number;
      seed: number | null;
      negativePrompt: string;
    }
  ) => void;
  isGenerating?: boolean;
  onMenuClick?: () => void;
}

export default function Navbar({
  onGenerate,
  isGenerating = false,
  onMenuClick,
}: NavbarProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [batchSize, setBatchSize] = useState(1);
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState(false);

  // Advanced settings state
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [steps, setSteps] = useState(4);
  const [seed, setSeed] = useState<number | null>(null);
  const [negativePrompt, setNegativePrompt] = useState("");

  // Admin auth hook
  const { isAdmin } = useAdminAuth();

  // Custom aspect ratio icons
  const AspectRatioIcon = ({
    ratio,
    className,
  }: {
    ratio: string;
    className: string;
  }) => {
    const iconProps = {
      className,
      fill: "currentColor",
      viewBox: "0 0 24 24",
    };

    switch (ratio) {
      case "1:1":
        return (
          <svg {...iconProps}>
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "3:4":
        return (
          <svg {...iconProps}>
            <rect
              x="7"
              y="4"
              width="10"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "4:3":
        return (
          <svg {...iconProps}>
            <rect
              x="4"
              y="7"
              width="16"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "16:9":
        return (
          <svg {...iconProps}>
            <rect
              x="3"
              y="8"
              width="18"
              height="8"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      case "9:16":
        return (
          <svg {...iconProps}>
            <rect
              x="8"
              y="3"
              width="8"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        );
    }
  };

  const aspectRatios = [
    {
      label: "1:1",
      value: "1:1",
      dimensions: "1024×1024",
      description: "Square",
    },
    {
      label: "3:4",
      value: "3:4",
      dimensions: "768×1024",
      description: "Portrait",
    },
    {
      label: "4:3",
      value: "4:3",
      dimensions: "1024×768",
      description: "Landscape",
    },
    {
      label: "16:9",
      value: "16:9",
      dimensions: "1024×576",
      description: "Widescreen",
    },
    {
      label: "9:16",
      value: "9:16",
      dimensions: "576×1024",
      description: "Vertical",
    },
  ];

  const handleGenerate = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), aspectRatio, batchSize, {
        steps,
        seed,
        negativePrompt,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Close dropdown/sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAspectRatioOpen(false);
        setIsAdvancedOpen(false);
      }
    };

    if (isAspectRatioOpen || isAdvancedOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isAspectRatioOpen, isAdvancedOpen]);

  // Aspect Ratio Selector Component with Dropdown
  const AspectRatioSelector = ({ className = "" }: { className?: string }) => {
    const isDesktop = className.includes("h-12");
    const selectedRatio = aspectRatios.find((r) => r.value === aspectRatio);

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsAspectRatioOpen(!isAspectRatioOpen)}
          className={`${
            isDesktop ? "px-3 py-3" : "px-2 py-2"
          } bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter transition-all duration-200 hover:bg-gray-600 flex items-center gap-2 ${
            isDesktop ? "h-12 min-w-[90px]" : "min-w-[80px]"
          }`}
          aria-label="Select aspect ratio"
        >
          <HiOutlineViewGrid className={isDesktop ? "w-4 h-4" : "w-3 h-3"} />
          <span>{selectedRatio?.label || "1:1"}</span>
          <HiChevronDown
            className={`${
              isDesktop ? "w-4 h-4" : "w-3 h-3"
            } transition-transform duration-200 ${
              isAspectRatioOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isAspectRatioOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsAspectRatioOpen(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute top-full mt-1 left-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 min-w-[200px]">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => {
                    setAspectRatio(ratio.value);
                    setIsAspectRatioOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 ${
                    aspectRatio === ratio.value
                      ? "bg-purple-500 text-white"
                      : "text-gray-300"
                  } ${ratio === aspectRatios[0] ? "rounded-t-lg" : ""} ${
                    ratio === aspectRatios[aspectRatios.length - 1]
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  <AspectRatioIcon
                    ratio={ratio.value}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{ratio.label}</div>
                    <div className="text-xs text-gray-400">
                      {ratio.description}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {ratio.dimensions}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Advanced Settings Button
  const AdvancedSettingsButton = ({
    className = "",
  }: {
    className?: string;
  }) => {
    const isDesktop = className.includes("h-12");

    return (
      <button
        onClick={() => setIsAdvancedOpen(true)}
        className={`${
          isDesktop ? "p-3" : "p-2"
        } bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 flex items-center justify-center ${
          isDesktop ? "h-12" : ""
        } ${className}`}
        aria-label="Open advanced settings"
        title="Advanced Settings"
      >
        <HiOutlineCog className={isDesktop ? "w-5 h-5" : "w-4 h-4"} />
      </button>
    );
  };

  // Batch Size Selector Component - Ratio button style
  const BatchSizeSelector = () => {
    const batchSizes = [1, 2, 3, 4];

    return (
      <div className="grid grid-cols-4 gap-2 w-full">
        {batchSizes.map((size) => (
          <button
            key={size}
            onClick={() => setBatchSize(size)}
            className={`p-3 rounded-lg border transition-all duration-200 flex items-center justify-center font-inter text-sm font-medium ${
              batchSize === size
                ? "bg-purple-500 border-purple-400 text-white"
                : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white hover:border-gray-500"
            }`}
            aria-label={`Set batch size to ${size}`}
          >
            {size}
          </button>
        ))}
      </div>
    );
  };

  // Advanced Settings Sidebar
  const AdvancedSettingsSidebar = () => {
    if (!isAdvancedOpen) return null;

    return (
      <>
        {/* Sidebar */}
        <div className="fixed top-[5rem] right-0 h-[calc(100vh-4.5rem)] w-96 bg-gray-800 border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700 rounded-tl-lg">
            <h3 className="text-lg font-semibold text-white font-space-grotesk">
              Advanced Settings
            </h3>
            <button
              onClick={() => setIsAdvancedOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              aria-label="Toggle advanced settings"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
            {/* Batch Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Batch Size
              </label>
              <BatchSizeSelector />
              <p className="text-xs text-gray-500 mt-1">
                Number of images to generate (1-4)
              </p>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Steps: {steps}
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                    (steps / 50) * 100
                  }%, #374151 ${(steps / 50) * 100}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>50</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Higher values = better quality, slower generation
              </p>
            </div>

            {/* Seed */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Seed
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed || ""}
                  onChange={(e) =>
                    setSeed(e.target.value ? Number(e.target.value) : null)
                  }
                  placeholder="Random"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
                />
                <button
                  onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors font-inter"
                >
                  Random
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use same seed for reproducible results
              </p>
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Negative Prompt
              </label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="What you don't want in the image..."
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe what to avoid in the generated image
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
        {/* Mobile Layout */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* Top row with hamburger, admin button, and generate button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <HiMenu className="w-6 h-6" />
                </button>
              )}
              {/* Admin Panel Access - Mobile */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs"
                >
                  <FiSettings className="w-3 h-3" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 font-inter text-sm ${
                !prompt.trim() || isGenerating
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              }`}
            >
              <HiSparkles
                className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
              />
              <span>{isGenerating ? "Generating..." : "Generate"}</span>
            </button>
          </div>

          {/* Prompt input */}
          <div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your image..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
            />
          </div>

          {/* Controls row */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <AspectRatioSelector />
            </div>
            <AdvancedSettingsButton />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center gap-4">
          {/* Prompt Input */}
          <div className="flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your image..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter h-12"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <AspectRatioSelector className="h-12" />

          {/* Advanced Settings Button */}
          <AdvancedSettingsButton className="h-12" />

          {/* Admin Panel Access - Desktop */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors h-12 font-inter"
            >
              <FiSettings className="w-4 h-4" />
              <span className="text-sm font-medium">Admin</span>
            </Link>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 font-inter h-12 ${
              !prompt.trim() || isGenerating
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105"
            }`}
          >
            <HiSparkles
              className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`}
            />
            <span>{isGenerating ? "Generating..." : "Generate"}</span>
          </button>
        </div>
      </div>

      {/* Advanced Settings Sidebar */}
      <AdvancedSettingsSidebar />
    </>
  );
}
