"use client";

import { useState } from "react";
import { HiSearch, HiFilter, HiSortAscending } from "react-icons/hi";
import ImageGrid from "./ImageGrid";
import { GeneratedImage } from "@/lib/api";

interface GalleryProps {
  images: GeneratedImage[];
  isLoading?: boolean;
}

export default function Gallery({ images, isLoading = false }: GalleryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "liked", label: "Liked First" },
  ];

  const filterOptions = [
    { value: "all", label: "All Images" },
    { value: "1:1", label: "Square (1:1)" },
    { value: "3:4", label: "Portrait (3:4)" },
    { value: "4:3", label: "Landscape (4:3)" },
    { value: "16:9", label: "Widescreen (16:9)" },
    { value: "9:16", label: "Vertical (9:16)" },
  ];

  // Filter and sort images
  const filteredAndSortedImages = images
    .filter((image) => {
      const matchesSearch = image.prompt
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterBy === "all" || image.aspectRatio === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "liked":
          // Assuming liked images have isLiked property
          if (a.isLiked && !b.isLiked) return -1;
          if (!a.isLiked && b.isLiked) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  return (
    <div className="flex flex-col h-full">
      {/* Gallery Header */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-space-grotesk">
              Your Gallery
            </h1>
            <p className="text-sm sm:text-base text-gray-400 font-inter">
              {images.length} image{images.length !== 1 ? "s" : ""} created
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search your images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
            />
          </div>

          {/* Sort and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <HiSortAscending className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 flex-1">
              <HiFilter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedImages.length === 0 && searchTerm ? (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center max-w-md mx-auto">
              <HiSearch className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 font-space-grotesk">
                No images found
              </h3>
              <p className="text-sm sm:text-base text-gray-400 font-inter px-4">
                Try adjusting your search terms or filters
              </p>
            </div>
          </div>
        ) : (
          <ImageGrid images={filteredAndSortedImages} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
