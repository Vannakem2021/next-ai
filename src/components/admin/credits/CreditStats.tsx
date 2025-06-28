"use client";

import {
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

// Simplified interfaces
interface CreditStats {
  totalRevenue: number;
  totalCreditsIssued: number;
  totalCreditsUsed: number;
  activeUsers: number;
}

interface CreditStatsProps {
  stats: CreditStats | null;
  loading: boolean;
}

export default function CreditStats({ stats, loading }: CreditStatsProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No credit data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simplified Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-green-400 text-sm mt-1">All time revenue</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Credits Issued</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(stats.totalCreditsIssued)}
              </p>
              <p className="text-blue-400 text-sm mt-1">Total sold</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Credits Used</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(stats.totalCreditsUsed)}
              </p>
              <p className="text-purple-400 text-sm mt-1">
                {(
                  (stats.totalCreditsUsed / stats.totalCreditsIssued) *
                  100
                ).toFixed(1)}
                % utilized
              </p>
            </div>
            <FiActivity className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(stats.activeUsers)}
              </p>
              <p className="text-orange-400 text-sm mt-1">Current active</p>
            </div>
            <FiUsers className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Simplified Credit Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Credit Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Revenue per Credit</span>
              <span className="text-white font-medium">
                {formatCurrency(stats.totalRevenue / stats.totalCreditsIssued)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credit Utilization</span>
              <span className="text-white font-medium">
                {(
                  (stats.totalCreditsUsed / stats.totalCreditsIssued) *
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
                  stats.totalCreditsIssued - stats.totalCreditsUsed
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credits per User</span>
              <span className="text-white font-medium">
                {(stats.totalCreditsIssued / stats.activeUsers).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
