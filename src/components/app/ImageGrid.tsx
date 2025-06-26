"use client";

import { useState } from "react";
import {
  HiDownload,
  HiHeart,
  HiOutlineHeart,
  HiDotsVertical,
} from "react-icons/hi";

import { GeneratedImage } from "@/lib/api";
import ImageDetailModal from "./ImageDetailModal";

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading?: boolean;
}

export default function ImageGrid({
  images,
  isLoading = false,
}: ImageGridProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLike = (imageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const handleImageClick = (image: GeneratedImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const downloadImage = async (
    imageUrl: string,
    prompt: string,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${prompt
        .slice(0, 30)
        .replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-700"></div>
              <div className="p-3 sm:p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <HiDownload className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-space-grotesk">
            No images yet
          </h3>
          <p className="text-sm sm:text-base text-gray-400 font-inter px-4">
            Start creating amazing images with AI. Enter a prompt above and
            click Generate!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
          >
            {/* Image */}
            <div
              className="relative aspect-square overflow-hidden cursor-pointer"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 pointer-events-none">
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                  <button
                    onClick={(e) => toggleLike(image.id, e)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    {likedImages.has(image.id) ? (
                      <HiHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    ) : (
                      <HiOutlineHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => downloadImage(image.url, image.prompt, e)}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <HiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <HiDotsVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image Info */}
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-2 font-inter">
                {image.prompt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-inter">{image.aspectRatio}</span>
                <span className="font-inter">
                  {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
