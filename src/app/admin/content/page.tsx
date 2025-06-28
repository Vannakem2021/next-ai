"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAPI } from "@/lib/adminApi";
import ContentFilters from "@/components/admin/content/ContentFilters";
import ContentGrid from "@/components/admin/content/ContentGrid";
import ContentDetailModal from "@/components/admin/content/ContentDetailModal";
import { FiImage, FiFlag, FiCheck, FiX, FiEye } from "react-icons/fi";

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

interface ContentFilters {
  status: string;
  flagType: string;
  dateRange: string;
  user: string;
}

export default function ContentModerationPage() {
  const { hasPermission } = useAdminAuth();
  const adminAPI = useAdminAPI();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentFilters>({
    status: "flagged",
    flagType: "all",
    dateRange: "all",
    user: "",
  });
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Fetch content from API
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.getContentList({
        page: currentPage,
        limit: 20,
        status: filters.status === "all" ? undefined : filters.status,
        flagType: filters.flagType === "all" ? undefined : filters.flagType,
        search: filters.user || undefined,
      });

      // Transform API response to ContentItem format
      const transformedContent = response.content.map(
        (item: Record<string, unknown>) => ({
          id: item.id,
          imageUrl: item.imageUrl || item.url,
          prompt: item.prompt,
          userId: item.userId,
          userEmail: item.userEmail,
          userName: item.userName,
          status: item.status || "approved", // Default to approved if no status
          flagType: item.flagType,
          flagReason: item.flagReason,
          createdAt: item.createdAt,
          moderatedAt: item.moderatedAt,
          moderatedBy: item.moderatedBy,
          aspectRatio: item.aspectRatio || "1:1",
          credits: item.credits || 1,
        })
      );

      setContent(transformedContent);
      setTotalPages(Math.ceil(response.total / 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content");
      setContent([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [adminAPI, currentPage, filters]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      alert("Please select items to moderate");
      return;
    }

    const updatedContent = content.map((item) => {
      if (selectedItems.includes(item.id)) {
        return {
          ...item,
          status: action as ContentItem["status"],
          moderatedAt: new Date().toISOString(),
          moderatedBy: "current-admin@example.com",
        };
      }
      return item;
    });

    setContent(updatedContent);
    setSelectedItems([]);
    alert(`${selectedItems.length} items ${action}`);
  };

  // Check permissions
  if (!hasPermission("moderator")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">
            You need moderator permissions to access content moderation.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: content.length,
    pending: content.filter((item) => item.status === "pending").length,
    approved: content.filter((item) => item.status === "approved").length,
    flagged: content.filter((item) => item.status === "flagged").length,
    removed: content.filter((item) => item.status === "removed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk">
            Content Moderation
          </h1>
          <p className="text-gray-400 mt-1">
            Review flagged content and handle user reports
          </p>
          <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <p className="text-blue-300 text-sm">
              ℹ️ <strong>Auto-Approval System:</strong> All generated images are
              automatically approved and visible to users immediately. Only
              flagged or reported content appears here for review.
            </p>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">
              {selectedItems.length} selected
            </span>
            <button
              onClick={() => handleBulkAction("approved")}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiCheck className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              onClick={() => handleBulkAction("flagged")}
              className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              <FiFlag className="w-4 h-4" />
              <span>Flag</span>
            </button>
            <button
              onClick={() => handleBulkAction("removed")}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <FiImage className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Auto-Approved</p>
              <p className="text-xl font-bold text-green-400">
                {stats.approved}
              </p>
            </div>
            <FiCheck className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Needs Review</p>
              <p className="text-xl font-bold text-orange-400">
                {stats.flagged}
              </p>
            </div>
            <FiEye className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Flagged</p>
              <p className="text-xl font-bold text-orange-400">
                {stats.flagged}
              </p>
            </div>
            <FiFlag className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Removed</p>
              <p className="text-xl font-bold text-red-400">{stats.removed}</p>
            </div>
            <FiX className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <ContentFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Content Grid */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <ContentGrid
          content={content}
          loading={loading}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          onContentSelect={setSelectedContent}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Content Detail Modal */}
      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onContentUpdate={(updatedContent) => {
            setContent(
              content.map((item) =>
                item.id === updatedContent.id ? updatedContent : item
              )
            );
            setSelectedContent(updatedContent);
          }}
        />
      )}
    </div>
  );
}
