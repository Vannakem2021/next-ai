"use client";

import { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiImage,
  FiUserX,
  FiUserCheck,
  FiEdit3,
} from "react-icons/fi";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLogin?: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  totalImages: number;
  totalPurchased?: number;
}

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUserUpdate: (user: User) => void;
}

export default function UserDetailModal({
  user,
  onClose,
  onUserUpdate,
}: UserDetailModalProps) {
  const [creditAdjustment, setCreditAdjustment] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");

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
      case "active":
        return "text-green-400";
      case "suspended":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const handleSuspendUser = () => {
    if (!suspensionReason.trim()) {
      alert("Please provide a reason for suspension");
      return;
    }

    const updatedUser = { ...user, status: "suspended" as const };
    onUserUpdate(updatedUser);
    alert("User suspended successfully");
  };

  const handleActivateUser = () => {
    const updatedUser = { ...user, status: "active" as const };
    onUserUpdate(updatedUser);
    alert("User activated successfully");
  };

  const handleCreditAdjustment = () => {
    const adjustment = parseInt(creditAdjustment);
    if (isNaN(adjustment) || !adjustmentReason.trim()) {
      alert("Please provide valid credit amount and reason");
      return;
    }

    const updatedUser = {
      ...user,
      totalCredits: user.totalCredits + adjustment,
      availableCredits: user.availableCredits + adjustment,
    };
    onUserUpdate(updatedUser);
    setCreditAdjustment("");
    setAdjustmentReason("");
    alert("Credits adjusted successfully");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white font-space-grotesk">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Basic Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.status === "active"
                          ? "bg-green-400"
                          : user.status === "suspended"
                          ? "bg-red-400"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={`capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Joined</p>
                    <p className="text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {user.lastLogin && (
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Last Login</p>
                      <p className="text-white">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Usage Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FiCreditCard className="w-5 h-5 text-blue-400" />
                    <p className="text-sm text-gray-400">Available Credits</p>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.availableCredits.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FiCreditCard className="w-5 h-5 text-purple-400" />
                    <p className="text-sm text-gray-400">Total Credits</p>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.totalCredits.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FiImage className="w-5 h-5 text-green-400" />
                    <p className="text-sm text-gray-400">Images Generated</p>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.totalImages.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <FiCreditCard className="w-5 h-5 text-orange-400" />
                    <p className="text-sm text-gray-400">Credits Used</p>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">
                    {user.usedCredits.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Admin Actions
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Status Actions */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-300">
                  User Status
                </h4>

                {user.status === "active" ? (
                  <div className="space-y-3">
                    <textarea
                      value={suspensionReason}
                      onChange={(e) => setSuspensionReason(e.target.value)}
                      placeholder="Reason for suspension..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                    <button
                      onClick={handleSuspendUser}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <FiUserX className="w-4 h-4" />
                      <span>Suspend User</span>
                    </button>
                  </div>
                ) : user.status === "suspended" ? (
                  <button
                    onClick={handleActivateUser}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <FiUserCheck className="w-4 h-4" />
                    <span>Activate User</span>
                  </button>
                ) : null}
              </div>

              {/* Credit Adjustment */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-300">
                  Credit Adjustment
                </h4>

                <div className="space-y-3">
                  <input
                    type="number"
                    value={creditAdjustment}
                    onChange={(e) => setCreditAdjustment(e.target.value)}
                    placeholder="Credit amount (+ or -)"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Reason for adjustment"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleCreditAdjustment}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    <span>Adjust Credits</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
