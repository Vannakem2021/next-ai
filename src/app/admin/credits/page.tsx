"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAPI } from "@/lib/adminApi";
import CreditPackages from "@/components/admin/credits/CreditPackages";
import CreditStats from "@/components/admin/credits/CreditStats";
import { FiCreditCard, FiTrendingUp } from "react-icons/fi";

// Simplified interfaces for credit management
interface CreditStats {
  totalRevenue: number;
  totalCreditsIssued: number;
  totalCreditsUsed: number;
  activeUsers: number;
}

export default function CreditManagementPage() {
  const { hasPermission } = useAdminAuth();
  const adminAPI = useAdminAPI();

  const [activeTab, setActiveTab] = useState<"overview" | "packages">(
    "overview"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified data states
  const [stats, setStats] = useState<CreditStats | null>(null);

  // Simplified fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user has admin permissions first
        if (!hasPermission("admin")) {
          setError("Admin access required. Please contact your administrator.");
          return;
        }

        // Fetch only analytics data
        const analyticsData = await adminAPI
          .getAnalyticsOverview(30)
          .catch(() => {
            // Return default analytics data
            return {
              total_revenue: 0,
              credits_issued: 0,
              credits_used: 0,
              active_users: 0,
            };
          });

        // Simplified stats transformation
        const transformedStats: CreditStats = {
          totalRevenue: analyticsData.total_revenue || 0,
          totalCreditsIssued: analyticsData.credits_issued || 0,
          totalCreditsUsed: analyticsData.credits_used || 0,
          activeUsers: analyticsData.active_users || 0,
        };

        setStats(transformedStats);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load credits data. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasPermission, adminAPI]);

  // Check permissions
  if (!hasPermission("admin")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">
            You need admin permissions to access credit management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white font-space-grotesk">
          Credit Management
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white font-space-grotesk">
          Credit Management
        </h1>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">Failed to load credits data: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk">
            Credit Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage credit packages, transactions, and user balances
          </p>
        </div>
      </div>

      {/* Simplified Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: FiTrendingUp },
            { id: "packages", label: "Credit Packages", icon: FiCreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "packages")}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Simplified Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <CreditStats stats={stats} loading={loading} />
        )}

        {activeTab === "packages" && <CreditPackages loading={loading} />}
      </div>
    </div>
  );
}
