"use client";

import { useState } from "react";
import { FiEye, FiCheck, FiFlag, FiX, FiUser } from "react-icons/fi";
import Image from "next/image";

interface ContentItem {
  id: string;
  imageUrl: string;
  prompt: string;
  userId: string;
  userEmail: string;
  userName?: string;
  status: "pending" | "approved" | "flagged" | "removed";
  flagType?: "inappropriate" | "copyright" | "spam" | "other";
  flagReason?: string;
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
  aspectRatio: string;
  credits: number;
}

interface ContentGridProps {
  content: ContentItem[];
  loading: boolean;
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onContentSelect: (content: ContentItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ContentGrid({
  content,
  loading,
  selectedItems,
  onSelectionChange,
  onContentSelect,
  currentPage,
  totalPages,
  onPageChange,
}: ContentGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
      flagged: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      },
      removed: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === content.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(content.map((item) => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg aspect-square mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="p-8 text-center">
        <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">
          No content found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Select All */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={
                selectedItems.length === content.length && content.length > 0
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-400">
              {selectedItems.length > 0
                ? `${selectedItems.length} of ${content.length} selected`
                : `${content.length} items`}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {content.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-700 rounded-lg overflow-hidden transition-all duration-200 ${
                selectedItems.includes(item.id)
                  ? "ring-2 ring-purple-500 transform scale-105"
                  : "hover:bg-gray-650"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="absolute top-3 left-3 w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 z-10"
                />

                {!imageErrors.has(item.id) ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.prompt}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => onContentSelect(item)}
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gray-600 flex items-center justify-center cursor-pointer"
                    onClick={() => onContentSelect(item)}
                  >
                    <FiEye className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(item.status)}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onContentSelect(item);
                    }}
                    className="p-2 bg-gray-800 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Info */}
              <div className="p-4 space-y-3">
                {/* Prompt */}
                <div>
                  <p className="text-white text-sm font-medium line-clamp-2">
                    {item.prompt}
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs truncate">
                      {item.userName || item.userEmail}
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(item.createdAt)}</span>
                  <span>{item.aspectRatio}</span>
                </div>

                {/* Flag Info */}
                {item.flagType && (
                  <div className="flex items-center space-x-2">
                    <FiFlag className="w-3 h-3 text-orange-400" />
                    <span className="text-xs text-orange-400 capitalize">
                      {item.flagType}
                    </span>
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  {item.status === "flagged" && (
                    <>
                      <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors">
                        <FiCheck className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors">
                        <FiX className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </>
                  )}
                  {item.status === "approved" && (
                    <button className="w-full flex items-center justify-center space-x-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs transition-colors">
                      <FiFlag className="w-3 h-3" />
                      <span>Flag for Review</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {content.length} items
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-400">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
