"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiImage,
  FiCheck,
  FiFlag,
  FiTrash2,
} from "react-icons/fi";

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

interface ContentDetailModalProps {
  content: ContentItem;
  onClose: () => void;
  onContentUpdate: (content: ContentItem) => void;
}

export default function ContentDetailModal({
  content,
  onClose,
  onContentUpdate,
}: ContentDetailModalProps) {
  const [flagType, setFlagType] = useState<string>(
    content.flagType || "inappropriate"
  );
  const [flagReason, setFlagReason] = useState<string>(
    content.flagReason || ""
  );
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "flagged":
        return "text-orange-400";
      case "removed":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const handleApprove = () => {
    const updatedContent = {
      ...content,
      status: "approved" as const,
      moderatedAt: new Date().toISOString(),
      moderatedBy: "current-admin@example.com",
      flagType: undefined,
      flagReason: undefined,
    };
    onContentUpdate(updatedContent);
    alert("Content approved successfully");
  };

  const handleFlag = () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging");
      return;
    }

    const updatedContent = {
      ...content,
      status: "flagged" as const,
      flagType: flagType as ContentItem["flagType"],
      flagReason: flagReason,
      moderatedAt: new Date().toISOString(),
      moderatedBy: "current-admin@example.com",
    };
    onContentUpdate(updatedContent);
    alert("Content flagged successfully");
  };

  const handleRemove = () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for removal");
      return;
    }

    const updatedContent = {
      ...content,
      status: "removed" as const,
      flagType: flagType as ContentItem["flagType"],
      flagReason: flagReason,
      moderatedAt: new Date().toISOString(),
      moderatedBy: "current-admin@example.com",
    };
    onContentUpdate(updatedContent);
    alert("Content removed successfully");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white font-space-grotesk">
            Content Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Generated Image
              </h3>

              <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                {!imageError ? (
                  <Image
                    src={content.imageUrl}
                    alt={content.prompt}
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Image not available</p>
                    </div>
                  </div>
                )}

                {/* Status Overlay */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 bg-opacity-80 ${getStatusColor(
                      content.status
                    )}`}
                  >
                    {content.status.charAt(0).toUpperCase() +
                      content.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Image Metadata */}
              <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Aspect Ratio</span>
                  <span className="text-white">{content.aspectRatio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Credits Used</span>
                  <span className="text-white">{content.credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Content ID</span>
                  <span className="text-white font-mono text-sm">
                    {content.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Prompt */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Prompt</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-white">{content.prompt}</p>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  User Information
                </h3>
                <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">
                        {content.userName || "Unknown User"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {content.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Created</p>
                      <p className="text-white">
                        {formatDate(content.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Moderation History */}
              {content.moderatedAt && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">
                    Moderation History
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <FiCalendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Moderated</p>
                        <p className="text-white">
                          {formatDate(content.moderatedAt)}
                        </p>
                      </div>
                    </div>
                    {content.moderatedBy && (
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Moderated by</p>
                          <p className="text-white">{content.moderatedBy}</p>
                        </div>
                      </div>
                    )}
                    {content.flagType && (
                      <div className="flex items-center space-x-3">
                        <FiFlag className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="text-gray-400 text-sm">Flag Type</p>
                          <p className="text-orange-400 capitalize">
                            {content.flagType}
                          </p>
                        </div>
                      </div>
                    )}
                    {content.flagReason && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm mb-1">Reason</p>
                        <p className="text-white">{content.flagReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Moderation Actions */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Moderation Actions
                </h3>

                {/* Flag/Remove Form */}
                {(content.status === "pending" ||
                  content.status === "approved") && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Flag Type
                      </label>
                      <select
                        value={flagType}
                        onChange={(e) => setFlagType(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="inappropriate">
                          Inappropriate Content
                        </option>
                        <option value="copyright">Copyright Violation</option>
                        <option value="spam">Spam</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Reason
                      </label>
                      <textarea
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        placeholder="Provide a detailed reason for this action..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {content.status !== "approved" && (
                    <button
                      onClick={handleApprove}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}

                  {content.status !== "flagged" && (
                    <button
                      onClick={handleFlag}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      <FiFlag className="w-4 h-4" />
                      <span>Flag</span>
                    </button>
                  )}

                  {content.status !== "removed" && (
                    <button
                      onClick={handleRemove}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
