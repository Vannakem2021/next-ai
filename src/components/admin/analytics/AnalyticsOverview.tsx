"use client";

import { FiUsers, FiImage, FiCreditCard, FiTrendingUp } from "react-icons/fi";

// Simplified analytics data structure
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
}

interface AnalyticsOverviewProps {
  data: AnalyticsData;
  loading: boolean;
}

export default function AnalyticsOverview({
  data,
  loading,
}: AnalyticsOverviewProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return "last 7 days";
      case "30d":
        return "last 30 days";
      case "90d":
        return "last 90 days";
      default:
        return "selected period";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simplified Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.totalUsers)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {getTimeRangeLabel(data.timeRange)}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.activeUsers)}
              </p>
              <p className="text-sm text-purple-400 mt-1">
                {(
                  (data.overview.activeUsers / data.overview.totalUsers) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Total Images */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Images Generated</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.totalImages)}
              </p>
              <p className="text-sm text-orange-400 mt-1">
                {getTimeRangeLabel(data.timeRange)}
              </p>
            </div>
            <FiImage className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        {/* Credits Issued */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Credits Issued</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.creditsIssued)}
              </p>
              <p className="text-sm text-green-400 mt-1">Total issued</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-green-400" />
          </div>
        </div>

        {/* Credits Used */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Credits Used</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.creditsUsed)}
              </p>
              <p className="text-sm text-yellow-400 mt-1">
                {(
                  (data.overview.creditsUsed / data.overview.creditsIssued) *
                  100
                ).toFixed(1)}
                % utilized
              </p>
            </div>
            <FiCreditCard className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold text-white">
                {data.overview.growthRate.toFixed(1)}%
              </p>
              <p className="text-sm text-green-400 mt-1">User growth</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
