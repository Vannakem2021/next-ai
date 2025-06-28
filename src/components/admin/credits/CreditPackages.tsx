"use client";

import { FiCreditCard } from "react-icons/fi";

// Simplified interface
interface CreditPackagesProps {
  loading: boolean;
}

export default function CreditPackages({ loading }: CreditPackagesProps) {
  // Mock data for simplified display
  const packages = [
    { name: "Starter Pack", credits: 100, price: 9.99, active: true },
    { name: "Pro Pack", credits: 500, price: 39.99, active: true },
    { name: "Creator Pack", credits: 1000, price: 69.99, active: true },
    { name: "Enterprise Pack", credits: 5000, price: 299.99, active: false },
  ];

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
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simplified Header */}
      <div>
        <h2 className="text-xl font-semibold text-white">Credit Packages</h2>
        <p className="text-gray-400 text-sm mt-1">
          Available credit packages and pricing
        </p>
      </div>

      {/* Simplified Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${
              !pkg.active ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <FiCreditCard className="w-8 h-8 text-purple-400" />
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pkg.active
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {pkg.active ? "Active" : "Inactive"}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">
              {pkg.name}
            </h3>

            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(pkg.price)}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {formatNumber(pkg.credits)} credits
              </p>
              <p className="text-gray-400 text-xs">
                ${(pkg.price / pkg.credits).toFixed(3)} per credit
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Package Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Package Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Packages</span>
              <span className="text-white font-medium">{packages.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Packages</span>
              <span className="text-white font-medium">
                {packages.filter((p) => p.active).length}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Price Range</span>
              <span className="text-white font-medium">
                {formatCurrency(Math.min(...packages.map((p) => p.price)))} -{" "}
                {formatCurrency(Math.max(...packages.map((p) => p.price)))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Credit Range</span>
              <span className="text-white font-medium">
                {formatNumber(Math.min(...packages.map((p) => p.credits)))} -{" "}
                {formatNumber(Math.max(...packages.map((p) => p.credits)))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
