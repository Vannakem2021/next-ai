"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HiX } from "react-icons/hi";
import { GeneratedImage } from "@/lib/api";

interface ImageDetailModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageDetailModal({
  image,
  isOpen,
  onClose,
}: ImageDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !image) return null;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  // Use actual metadata from the image
  const model = image.model || "PicLumen Art V1";
  const seed = image.seed || Math.floor(Math.random() * 100000000);
  const guidanceScale = image.guidanceScale || 1;
  const resolution =
    image.width && image.height
      ? `${image.width} x ${image.height} (1:1)`
      : "1024 x 1024 (1:1)";

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-black/90 backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onClick={handleBackdropClick}
    >
      {/* Mobile View - Full Screen Image */}
      <div className="md:hidden flex items-center justify-center h-full relative">
        {/* Close Button for Mobile */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:bg-black/80 transition-colors shadow-lg safe-area-inset-top"
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
        >
          <HiX className="w-6 h-6" />
        </button>

        {/* Full Screen Image */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <Image
            src={image.url}
            alt={image.prompt}
            width={800}
            height={800}
            className="max-w-full max-h-full object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Desktop View - Detailed Modal */}
      <div className="hidden md:flex items-center justify-center p-4 h-full">
        <div
          className={`
            bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden
            border border-gray-700 shadow-2xl
            transform transition-all duration-300 ease-in-out
            ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
          `}
        >
          <div className="flex h-full">
            {/* Image Section */}
            <div className="flex-1 bg-gray-800 flex items-center justify-center p-6">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={image.url}
                  alt={image.prompt}
                  width={600}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  unoptimized
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white font-space-grotesk">
                  Image Details
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Details Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Prompt
                  </label>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <p className="text-sm text-gray-300 font-inter leading-relaxed">
                      {image.prompt}
                    </p>
                  </div>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Model
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-white font-inter">
                      {model}
                    </span>
                  </div>
                </div>

                {/* Date created */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Date created
                  </label>
                  <p className="text-sm text-white font-inter">
                    {formatDate(image.createdAt)}
                  </p>
                </div>

                {/* Seed */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Seed
                  </label>
                  <p className="text-sm text-white font-inter">{seed}</p>
                </div>

                {/* Guidance Scale */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Guidance Scale
                  </label>
                  <p className="text-sm text-white font-inter">
                    {guidanceScale}
                  </p>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 font-inter">
                    Resolution
                  </label>
                  <p className="text-sm text-white font-inter">{resolution}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
