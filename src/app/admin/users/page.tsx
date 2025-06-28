"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminAPI, AdminUser } from "@/lib/adminApi";
import UserList from "@/components/admin/users/UserList";
import UserSearch from "@/components/admin/users/UserSearch";
import UserFilters from "@/components/admin/users/UserFilters";
import UserDetailModal from "@/components/admin/users/UserDetailModal";
import { FiUsers, FiUserPlus, FiDownload } from "react-icons/fi";

interface UserFilters {
  status: string;
  dateRange: string;
  creditRange: string;
}

export default function UserManagementPage() {
  const { hasPermission } = useAdminAuth();
  const adminAPI = useAdminAPI();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    status: "all",
    dateRange: "all",
    creditRange: "all",
  });
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminAPI.getUsers(
        currentPage,
        50, // limit
        searchQuery || undefined,
        filters.status !== "all" ? filters.status : undefined
      );

      setUsers(response.users);
      setTotalUsers(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [adminAPI, currentPage, filters, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Check permissions
  if (!hasPermission("admin")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400">
            You need admin permissions to access user management.
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white font-space-grotesk">
            User Management
          </h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400">Failed to load users: {error}</p>
          <button
            onClick={fetchUsers}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-space-grotesk">
            User Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage user accounts, credits, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <FiUserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status === "suspended").length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status === "pending").length}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UserSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <div className="lg:w-auto">
            <UserFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <UserList
          users={users}
          loading={loading}
          onUserSelect={(user) => setSelectedUser(user as AdminUser)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdate={(updatedUser) => {
            setUsers(
              users.map((u) =>
                u.id === updatedUser.id ? (updatedUser as AdminUser) : u
              )
            );
            setSelectedUser(updatedUser as AdminUser);
          }}
        />
      )}
    </div>
  );
}
