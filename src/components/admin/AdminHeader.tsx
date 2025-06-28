"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

export default function AdminHeader() {
  const { user } = useAdminAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get page title based on current path
  const getPageTitle = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/users":
        return "User Management";
      case "/admin/credits":
        return "Credit Management";
      case "/admin/content":
        return "Content Moderation";
      case "/admin/analytics":
        return "Analytics";
      case "/admin/system":
        return "System Health";
      case "/admin/audit":
        return "Audit Log";
      default:
        return "Admin Panel";
    }
  };

  return (
    <>
      <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4 w-full shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>

            <div>
              <h1 className="text-xl font-semibold text-white font-space-grotesk">
                {getPageTitle()}
              </h1>
              <p className="text-gray-400 text-sm hidden sm:block">
                Welcome back, {user?.firstName || "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Button from Clerk */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
              afterSignOutUrl="/auth"
            />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative">
            <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
