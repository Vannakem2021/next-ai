"use client";

import { FiFilter } from "react-icons/fi";

interface UserFilters {
  status: string;
  dateRange: string;
  creditRange: string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export default function UserFilters({ filters, onFiltersChange }: UserFiltersProps) {
  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <FiFilter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Filters:</span>
      </div>

      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="pending">Pending</option>
      </select>

      {/* Date Range Filter */}
      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange("dateRange", e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
      </select>

      {/* Credit Range Filter */}
      <select
        value={filters.creditRange}
        onChange={(e) => handleFilterChange("creditRange", e.target.value)}
        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="all">All Credits</option>
        <option value="0">No Credits</option>
        <option value="1-100">1-100 Credits</option>
        <option value="101-500">101-500 Credits</option>
        <option value="501+">500+ Credits</option>
      </select>

      {/* Clear Filters */}
      {(filters.status !== "all" || filters.dateRange !== "all" || filters.creditRange !== "all") && (
        <button
          onClick={() =>
            onFiltersChange({
              status: "all",
              dateRange: "all",
              creditRange: "all",
            })
          }
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
