"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HiPhotograph, HiCollection, HiX } from "react-icons/hi";
import { UserProfile } from "@/lib/api";

interface SidebarProps {
  userProfile: UserProfile | null;
  isOpen?: boolean;
  onClose?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function Sidebar({
  userProfile,
  isOpen = false,
  onClose,
  isLoading = false,
  error = null,
}: SidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();

  const navigationItems = [
    {
      id: "create" as const,
      name: "Create",
      icon: HiPhotograph,
      description: "Generate new images",
      href: "/app/create",
    },
    {
      id: "gallery" as const,
      name: "Gallery",
      icon: HiCollection,
      description: "View your creations",
      href: "/app/gallery",
    },
  ];

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname === "/app/gallery") return "gallery";
    return "create"; // Default to create for /app and /app/create
  };

  const activeTab = getActiveTab();

  return (
    <div
      className={`
      w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen
      fixed inset-y-0 left-0 z-50
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg font-space-grotesk">
                AI
              </span>
            </div>
            <span className="ml-2 text-xl font-bold text-white font-space-grotesk">
              Creative Studio
            </span>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after selection
                  if (onClose && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                <div>
                  <div
                    className={`font-medium font-inter ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 font-inter">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "bg-gray-800 border-gray-700",
                userButtonPopoverActionButton:
                  "text-gray-300 hover:text-white hover:bg-gray-700",
                userButtonPopoverActionButtonText: "font-inter",
                userButtonPopoverFooter: "hidden",
              },
            }}
            afterSignOutUrl="/auth"
          />
          <div className="flex-1 min-w-0">
            {isLoading || !userProfile ? (
              <>
                <div className="h-4 bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
              </>
            ) : error ? (
              <>
                <div className="text-sm font-medium text-white truncate font-inter">
                  {user?.firstName || "Creator"}
                </div>
                <div className="text-xs text-red-400 font-inter">
                  Connection error
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-white truncate font-inter">
                  {userProfile.first_name || user?.firstName || "Creator"}
                </div>
                <div className="text-xs text-gray-400 font-inter">
                  {userProfile.available_credits ?? 0} credits
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
