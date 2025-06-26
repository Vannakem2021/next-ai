"use client";

import { useState } from "react";
import { HiSparkles, HiMenu } from "react-icons/hi";

interface NavbarProps {
  onGenerate: (prompt: string, aspectRatio: string, batchSize: number) => void;
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

  const aspectRatios = [
    { label: "1:1", value: "1:1", dimensions: "1024×1024" },
    { label: "3:4", value: "3:4", dimensions: "768×1024" },
    { label: "4:3", value: "4:3", dimensions: "1024×768" },
    { label: "16:9", value: "16:9", dimensions: "1024×576" },
    { label: "9:16", value: "9:16", dimensions: "576×1024" },
  ];

  const batchSizes = [1, 2, 3, 4];

  const handleGenerate = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), aspectRatio, batchSize);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Top row with hamburger and generate button */}
        <div className="flex items-center justify-between">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <HiMenu className="w-6 h-6" />
            </button>
          )}
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
        <div className="flex gap-2 sm:gap-3">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio.value} value={ratio.value}>
                {ratio.label}
              </option>
            ))}
          </select>
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter min-w-[60px] sm:min-w-[80px]"
          >
            {batchSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
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
        <div>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter min-w-[140px] h-12"
          >
            {aspectRatios.map((ratio) => (
              <option key={ratio.value} value={ratio.value}>
                {ratio.label} ({ratio.dimensions})
              </option>
            ))}
          </select>
        </div>

        {/* Batch Size Selector */}
        <div>
          <select
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter min-w-[90px] h-12"
          >
            {batchSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

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
  );
}
