"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAPI } from "@/lib/adminApi";
import AnalyticsOverview from "@/components/admin/analytics/AnalyticsOverview";
import UserAnalytics from "@/components/admin/analytics/UserAnalytics";
import RevenueAnalytics from "@/components/admin/analytics/RevenueAnalytics";
import UsageAnalytics from "@/components/admin/analytics/UsageAnalytics";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiCalendar,
} from "react-icons/fi";

// Simplified analytics data structure using only real API data
interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    totalImages: number;
    creditsIssued: number;
    creditsUsed: number;
    growthRate: number;
  };
  timeRange: "7d" | "30d" | "90d";
  dailyData: Array<{
    date: string;
    images_generated: number;
    active_users: number;
    new_users: number;
    credits_used: number;
  }>;
  userSegments: {
    free_users: number;
    paid_users: number;
    total_users: number;
  };
  usagePatterns: {
    avg_images_per_user: number;
    avg_credits_per_user: number;
  };
}

export default function AnalyticsDashboardPage() {
  const { hasPermission } = useAdminAuth();
  const adminAPI = useAdminAPI();

  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "revenue" | "usage"
  >("overview");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  // Simplified fetch analytics data from API - only real data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);

      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

      const [analyticsResponse, detailedResponse] = await Promise.all([
        adminAPI.getAnalyticsOverview(days),
        adminAPI.getDetailedAnalytics(days),
      ]);

      // Transform API response to simplified AnalyticsData interface
      const transformedData: AnalyticsData = {
        overview: {
          totalUsers: analyticsResponse.total_users,
          activeUsers: analyticsResponse.active_users,
          totalRevenue: analyticsResponse.total_revenue,
          totalImages: analyticsResponse.total_images,
          creditsIssued: analyticsResponse.credits_issued,
          creditsUsed: analyticsResponse.credits_used,
          growthRate: analyticsResponse.growth_metrics?.userGrowthRate || 0,
        },
        timeRange: timeRange,
        dailyData: detailedResponse?.daily_data || [],
        userSegments: detailedResponse?.user_segments || {
          free_users: 0,
          paid_users: 0,
          total_users: analyticsResponse.total_users,
        },
        usagePatterns: detailedResponse?.usage_patterns || {
          avg_images_per_user: 0,
          avg_credits_per_user: 0,
        },
      };

      setAnalyticsData(transformedData);
    } catch {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  }, [timeRange, adminAPI]);

  // Remove mock data generator - only use real API data

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Check permissions
  if (!hasPermission("admin")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">
            You need admin permissions to access analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Comprehensive insights into platform performance and user behavior
          </p>
        </div>

        {/* Simplified Time Range Selector */}
        <div className="flex items-center space-x-2">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "7d" | "30d" | "90d")
            }
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: FiTrendingUp },
            { id: "users", label: "User Analytics", icon: FiUsers },
            { id: "revenue", label: "Revenue Analytics", icon: FiDollarSign },
            { id: "usage", label: "Usage Analytics", icon: FiActivity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "overview" | "users" | "revenue" | "usage"
                )
              }
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

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {!analyticsData ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <AnalyticsOverview data={analyticsData} loading={loading} />
            )}

            {activeTab === "users" && (
              <UserAnalytics data={analyticsData} loading={loading} />
            )}

            {activeTab === "revenue" && (
              <RevenueAnalytics data={analyticsData} loading={loading} />
            )}

            {activeTab === "usage" && (
              <UsageAnalytics data={analyticsData} loading={loading} />
            )}
          </>
        )}
      </div>

      {/* Removed complex export options - keeping it simple */}
    </div>
  );
}
