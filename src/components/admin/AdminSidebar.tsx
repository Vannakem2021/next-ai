"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiUsers,
  FiCreditCard,
  FiImage,
  FiBarChart,
  FiShield,
  FiActivity,
  FiHome,
  FiTrendingUp,
} from "react-icons/fi";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export default function AdminSidebar({ onNavigate }: AdminSidebarProps = {}) {
  const { hasPermission, user } = useAdminAuth();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: FiBarChart,
      requiredRole: "moderator" as const,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: FiUsers,
      requiredRole: "admin" as const,
    },
    {
      name: "Credit Management",
      href: "/admin/credits",
      icon: FiCreditCard,
      requiredRole: "admin" as const,
    },
    {
      name: "Content Moderation",
      href: "/admin/content",
      icon: FiImage,
      requiredRole: "moderator" as const,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: FiTrendingUp,
      requiredRole: "admin" as const,
    },
    {
      name: "System Health",
      href: "/admin/system",
      icon: FiActivity,
      requiredRole: "super_admin" as const,
    },
    {
      name: "Audit Log",
      href: "/admin/audit",
      icon: FiShield,
      requiredRole: "super_admin" as const,
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    hasPermission(item.requiredRole)
  );

  return (
    <div className="w-64 h-screen bg-gray-800 border-r border-gray-700 flex flex-col shadow-xl">
      {/* Admin Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg font-space-grotesk">
              A
            </span>
          </div>
          <div>
            <h2 className="text-white font-semibold font-space-grotesk">
              Admin Panel
            </h2>
            <p className="text-gray-400 text-sm">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to App - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <Link
          href="/app/create"
          onClick={onNavigate}
          className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <FiHome className="w-5 h-5" />
          <span className="font-medium">Back to App</span>
        </Link>
        <div className="text-xs text-gray-400 mt-2 truncate">
          Logged in as: {user?.primaryEmailAddress?.emailAddress}
        </div>
      </div>
    </div>
  );
}
