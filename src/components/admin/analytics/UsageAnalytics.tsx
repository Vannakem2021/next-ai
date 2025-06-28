"use client";

import { FiImage, FiCreditCard, FiActivity } from "react-icons/fi";

// Simplified analytics data structure
interface AnalyticsData {
  overview: {
    totalImages: number;
    creditsUsed: number;
    activeUsers: number;
  };
  timeRange: "7d" | "30d" | "90d";
  dailyData: Array<{
    date: string;
    images_generated: number;
    credits_used: number;
  }>;
  usagePatterns: {
    avg_images_per_user: number;
    avg_credits_per_user: number;
  };
}

interface UsageAnalyticsProps {
  data: AnalyticsData;
  loading: boolean;
}

export default function UsageAnalytics({ data, loading }: UsageAnalyticsProps) {
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
      {/* Simplified Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Images */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Images Generated</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(data.overview.totalImages)}
              </p>
              <p className="text-sm text-blue-400 mt-1">Total generated</p>
            </div>
            <FiImage className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-green-400 mt-1">Total consumed</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-green-400" />
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
              <p className="text-sm text-purple-400 mt-1">Currently active</p>
            </div>
            <FiActivity className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Usage Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credits per Image</span>
              <span className="text-white font-medium">
                {(
                  data.overview.creditsUsed / data.overview.totalImages
                ).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Usage Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {data.dailyData.slice(-3).map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {formatNumber(day.images_generated)} images
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatNumber(day.credits_used)} credits
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
