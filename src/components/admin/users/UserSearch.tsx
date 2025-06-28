"use client";

import { FiSearch, FiX } from "react-icons/fi";

interface UserSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function UserSearch({ searchQuery, onSearchChange }: UserSearchProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search users by email, name..."
        className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <FiX className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}
