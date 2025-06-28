"use client";

import { FiDollarSign, FiCreditCard } from "react-icons/fi";

// Simplified analytics data structure
interface AnalyticsData {
  overview: {
    totalRevenue: number;
    creditsIssued: number;
    creditsUsed: number;
  };
  timeRange: "7d" | "30d" | "90d";
}

interface RevenueAnalyticsProps {
  data: AnalyticsData;
  loading: boolean;
}

export default function RevenueAnalytics({
  data,
  loading,
}: RevenueAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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
      {/* Simplified Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(data.overview.totalRevenue)}
              </p>
              <p className="text-sm text-green-400 mt-1">All time revenue</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-400" />
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
              <p className="text-sm text-blue-400 mt-1">Total credits sold</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-purple-400 mt-1">
                {(
                  (data.overview.creditsUsed / data.overview.creditsIssued) *
                  100
                ).toFixed(1)}
                % utilized
              </p>
            </div>
            <FiCreditCard className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Revenue Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Revenue per Credit</span>
              <span className="text-white font-medium">
                {formatCurrency(
                  data.overview.totalRevenue / data.overview.creditsIssued
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credit Utilization</span>
              <span className="text-white font-medium">
                {(
                  (data.overview.creditsUsed / data.overview.creditsIssued) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Unused Credits</span>
              <span className="text-white font-medium">
                {formatNumber(
                  data.overview.creditsIssued - data.overview.creditsUsed
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Potential Revenue</span>
              <span className="text-white font-medium">
                {formatCurrency(
                  (data.overview.creditsIssued - data.overview.creditsUsed) *
                    (data.overview.totalRevenue / data.overview.creditsIssued)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
