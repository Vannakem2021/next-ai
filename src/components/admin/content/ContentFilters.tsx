"use client";

import { FiFilter, FiSearch, FiX } from "react-icons/fi";

interface ContentFilters {
  status: string;
  flagType: string;
  dateRange: string;
  user: string;
}

interface ContentFiltersProps {
  filters: ContentFilters;
  onFiltersChange: (filters: ContentFilters) => void;
}

export default function ContentFilters({
  filters,
  onFiltersChange,
}: ContentFiltersProps) {
  const handleFilterChange = (key: keyof ContentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: "all",
      flagType: "all",
      dateRange: "all",
      user: "",
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.flagType !== "all" ||
    filters.dateRange !== "all" ||
    filters.user !== "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filters:</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FiX className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Auto-Approved</option>
            <option value="flagged">Flagged/Reported</option>
            <option value="removed">Removed</option>
          </select>
        </div>

        {/* Flag Type Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Flag Type</label>
          <select
            value={filters.flagType}
            onChange={(e) => handleFilterChange("flagType", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="copyright">Copyright</option>
            <option value="spam">Spam</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        {/* User Search */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">User</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
              placeholder="Search by user..."
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {filters.user && (
              <button
                onClick={() => handleFilterChange("user", "")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="h-4 w-4 text-gray-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange("status", "flagged")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.status === "flagged"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Needs Review
        </button>
        <button
          onClick={() => handleFilterChange("flagType", "inappropriate")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.flagType === "inappropriate"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Inappropriate
        </button>
        <button
          onClick={() => handleFilterChange("flagType", "copyright")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.flagType === "copyright"
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Copyright Issues
        </button>
        <button
          onClick={() => handleFilterChange("status", "approved")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            filters.status === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Auto-Approved
        </button>
      </div>
    </div>
  );
}
