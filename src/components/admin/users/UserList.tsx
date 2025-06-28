"use client";

import { FiEye, FiUserX, FiUserCheck, FiCreditCard } from "react-icons/fi";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastLogin?: string;
  totalCredits: number;
  usedCredits: number;
  availableCredits: number;
  totalImages: number;
  totalPurchased?: number;
}

interface UserListProps {
  users: User[];
  loading: boolean;
  onUserSelect: (user: User) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function UserList({
  users,
  loading,
  onUserSelect,
  currentPage,
  totalPages,
  onPageChange,
}: UserListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: "bg-green-100 text-green-800 border-green-200",
      suspended: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          statusConfig[status as keyof typeof statusConfig]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No users found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div className="col-span-3">User</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Credits</div>
          <div className="col-span-2">Images</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-700">
        {users.map((user) => (
          <div
            key={user.id}
            className="px-6 py-4 hover:bg-gray-750 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* User Info */}
              <div className="col-span-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email.split("@")[0]}
                    </p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                {getStatusBadge(user.status)}
              </div>

              {/* Credits */}
              <div className="col-span-2">
                <div className="text-white font-medium">
                  {user.availableCredits.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  of {user.totalCredits.toLocaleString()}
                </div>
              </div>

              {/* Images */}
              <div className="col-span-2">
                <div className="text-white font-medium">
                  {user.totalImages.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">generated</div>
              </div>

              {/* Joined Date */}
              <div className="col-span-2">
                <div className="text-white">{formatDate(user.createdAt)}</div>
                {user.lastLogin && (
                  <div className="text-gray-400 text-sm">
                    Last: {formatDate(user.lastLogin)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUserSelect(user)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  
                  {user.status === "active" ? (
                    <button
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Suspend User"
                    >
                      <FiUserX className="w-4 h-4" />
                    </button>
                  ) : user.status === "suspended" ? (
                    <button
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Activate User"
                    >
                      <FiUserCheck className="w-4 h-4" />
                    </button>
                  ) : null}
                  
                  <button
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                    title="Adjust Credits"
                  >
                    <FiCreditCard className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
