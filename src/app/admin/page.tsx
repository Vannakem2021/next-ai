"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAPI, AnalyticsOverview } from "@/lib/adminApi";
import {
  FiUsers,
  FiCreditCard,
  FiImage,
  FiActivity,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";

export default function AdminDashboard() {
  const { user, hasPermission } = useAdminAuth();
  const adminAPI = useAdminAPI();

  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [recentActivity, setRecentActivity] = useState<
    Record<string, unknown>[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsData, activityData] = await Promise.all([
          adminAPI.getAnalyticsOverview(30),
          adminAPI.getRecentActivity(10),
        ]);
        setAnalytics(analyticsData);
        setRecentActivity(activityData.activities || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminAPI]);

  // Format numbers for display
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const stats = analytics
    ? [
        {
          name: "Total Users",
          value: formatNumber(analytics.total_users),
          change: `+${analytics.growth_metrics.userGrowthRate.toFixed(1)}%`,
          changeType: "positive" as const,
          icon: FiUsers,
        },
        {
          name: "Images Generated",
          value: formatNumber(analytics.total_images),
          change: analytics.growth_metrics?.userGrowthRate
            ? `+${analytics.growth_metrics.userGrowthRate.toFixed(1)}%`
            : "+0%",
          changeType: "positive" as const,
          icon: FiImage,
        },
        {
          name: "Credits Issued",
          value: formatNumber(analytics.credits_issued),
          change: analytics.growth_metrics?.userGrowthRate
            ? `+${analytics.growth_metrics.userGrowthRate.toFixed(1)}%`
            : "+0%",
          changeType: "positive" as const,
          icon: FiCreditCard,
        },
        {
          name: "Revenue",
          value: formatCurrency(analytics.total_revenue),
          change: analytics.growth_metrics?.userGrowthRate
            ? `+${analytics.growth_metrics.userGrowthRate.toFixed(1)}%`
            : "+0%",
          changeType: "positive" as const,
          icon: FiDollarSign,
        },
      ]
    : [];

  // Helper function to format activity display
  const formatActivity = (activity: Record<string, unknown>) => {
    if (activity.type === "admin_action") {
      return {
        user: activity.adminId as string,
        action: `${activity.action as string} ${
          activity.resourceType as string
        }`,
        time: new Date(activity.createdAt as string).toLocaleString(),
      };
    } else if (activity.type === "image_generation") {
      return {
        user: activity.userEmail as string,
        action: `Generated image: "${activity.prompt as string}"`,
        time: new Date(activity.createdAt as string).toLocaleString(),
      };
    }
    return {
      user: "Unknown",
      action: "Unknown action",
      time: "Unknown time",
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold font-space-grotesk mb-2">
            Welcome back, {user?.firstName || "Admin"}!
          </h2>
          <p className="text-red-100">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold font-space-grotesk mb-2">
            Welcome back, {user?.firstName || "Admin"}!
          </h2>
          <p className="text-red-100">Error loading dashboard data</p>
        </div>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">Failed to load analytics: {error}</p>
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold font-space-grotesk mb-2">
          Welcome back, {user?.firstName || "Admin"}!
        </h2>
        <p className="text-red-100">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-gray-700 rounded-lg">
                <stat.icon className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FiTrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm font-medium">
                {stat.change}
              </span>
              <span className="text-gray-400 text-sm ml-1">
                from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const formatted = formatActivity(activity);
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "admin_action"
                          ? "bg-orange-400"
                          : "bg-blue-400"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{formatted.user}</span>{" "}
                        {formatted.action}
                      </p>
                      <p className="text-gray-400 text-xs">{formatted.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-space-grotesk">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {hasPermission("admin") && (
              <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FiUsers className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Manage Users</p>
                    <p className="text-gray-400 text-sm">
                      View and manage user accounts
                    </p>
                  </div>
                </div>
              </button>
            )}

            <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <FiImage className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white font-medium">Review Content</p>
                  <p className="text-gray-400 text-sm">
                    Moderate flagged images
                  </p>
                </div>
              </div>
            </button>

            {hasPermission("super_admin") && (
              <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FiActivity className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">System Health</p>
                    <p className="text-gray-400 text-sm">Check system status</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
