"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { HiDownload, HiHeart, HiOutlineHeart, HiTrash } from "react-icons/hi";

import { GeneratedImage, useAPI } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import ImageDetailModal from "./ImageDetailModal";

interface ImageGridProps {
  images: GeneratedImage[];
  isLoading?: boolean;
  onImageDeleted?: (imageId: string) => void;
}

interface GroupedImages {
  date: string;
  label: string;
  images: GeneratedImage[];
}

// Utility function to get relative date label
const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    // For older dates, show the actual date
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else {
      return inputDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year:
          inputDate.getFullYear() !== today.getFullYear()
            ? "numeric"
            : undefined,
      });
    }
  }
};

// Utility function to group images by date
const groupImagesByDate = (images: GeneratedImage[]): GroupedImages[] => {
  const groups = new Map<string, GeneratedImage[]>();

  images.forEach((image) => {
    const date = new Date(image.createdAt);
    const dateKey = date.toDateString(); // Use date string as key for grouping

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(image);
  });

  // Convert to array and sort by date (newest first)
  const groupedArray: GroupedImages[] = Array.from(groups.entries())
    .map(([dateKey, images]) => ({
      date: dateKey,
      label: getDateLabel(new Date(dateKey)),
      images: images.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return groupedArray;
};

export default function ImageGrid({
  images,
  isLoading = false,
  onImageDeleted,
}: ImageGridProps) {
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const api = useAPI();
  const { showError, showSuccess } = useToast();

  // Group images by date using useMemo for performance
  const groupedImages = useMemo(() => {
    return groupImagesByDate(images);
  }, [images]);

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

  const handleDeleteClick = (imageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowDeleteConfirm(imageId);
  };

  const handleDeleteConfirm = async (imageId: string) => {
    setShowDeleteConfirm(null);
    setDeletingImages((prev) => new Set(prev).add(imageId));

    try {
      await api.deleteImage(imageId);

      // Call the callback to remove from parent state
      if (onImageDeleted) {
        onImageDeleted(imageId);
      }

      showSuccess("Image deleted successfully");
    } catch (error) {
      console.error("Failed to delete image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete image";
      showError("Delete Failed", errorMessage);
    } finally {
      setDeletingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
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
      {groupedImages.map((group, groupIndex) => (
        <div key={group.date} className={groupIndex > 0 ? "mt-8" : ""}>
          {/* Date Separator */}
          <div className="flex items-center mb-6">
            <h2 className="text-lg font-semibold text-white font-space-grotesk mr-4">
              {group.label}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent"></div>
          </div>

          {/* Images Grid for this date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {group.images.map((image) => (
              <div
                key={image.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.prompt}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    unoptimized
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
                        onClick={(e) =>
                          downloadImage(image.url, image.prompt, e)
                        }
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        <HiDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(image.id, e)}
                        disabled={deletingImages.has(image.id)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingImages.has(image.id) ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <HiTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
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
        </div>
      ))}

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2 font-space-grotesk">
              Delete Image
            </h3>
            <p className="text-gray-300 mb-6 font-inter">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-inter"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-inter"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
