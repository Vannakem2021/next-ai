"use client";

import { FiUsers, FiUserPlus, FiUserCheck } from "react-icons/fi";

// Simplified analytics data structure
interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    growthRate: number;
  };
  timeRange: "7d" | "30d" | "90d";
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

interface UserAnalyticsProps {
  data: AnalyticsData;
  loading: boolean;
}

export default function UserAnalytics({ data, loading }: UserAnalyticsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
      {/* Simplified User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.totalUsers)}
              </p>
              <p className="text-sm text-blue-400 mt-1">All registered users</p>
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
              <p className="text-sm text-green-400 mt-1">
                {(
                  (data.overview.activeUsers / data.overview.totalUsers) *
                  100
                ).toFixed(1)}
                % of total
              </p>
            </div>
            <FiUserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>

        {/* New Users */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold text-white">
                {data.overview.growthRate.toFixed(1)}%
              </p>
              <p className="text-sm text-purple-400 mt-1">User growth</p>
            </div>
            <FiUserPlus className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* User Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            User Segments
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-white">Free Users</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {formatNumber(data.userSegments.free_users)}
                </p>
                <p className="text-gray-400 text-sm">
                  {(
                    (data.userSegments.free_users /
                      data.userSegments.total_users) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-white">Paid Users</span>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {formatNumber(data.userSegments.paid_users)}
                </p>
                <p className="text-gray-400 text-sm">
                  {(
                    (data.userSegments.paid_users /
                      data.userSegments.total_users) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Patterns */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Usage Patterns
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Avg Images per User</span>
              <span className="text-white font-medium">
                {data.usagePatterns.avg_images_per_user.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Avg Credits per User</span>
              <span className="text-white font-medium">
                {data.usagePatterns.avg_credits_per_user.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
