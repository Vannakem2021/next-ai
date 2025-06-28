"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { ToastProvider } from "@/contexts/ToastContext";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import Sidebar from "@/components/app/Sidebar";
import Navbar from "@/components/app/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

function AppLayoutContent({ children, showNavbar = true }: AppLayoutProps) {
  const { isLoaded, isSignedIn } = useUser();
  const {
    userProfile,
    loading,
    error,
    isGenerating,
    handleGenerate,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useAppContext();

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  // Note: Authentication redirects are now handled by individual pages
  // This component assumes the user is already authenticated

  // Show loading state only if Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl font-space-grotesk">
              AI
            </span>
          </div>
          <p className="text-gray-300 font-inter">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not signed in, don't render the app layout
  // The page-level components will handle redirects
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <Sidebar
        userProfile={userProfile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoading={loading}
        error={error}
      />

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        {showNavbar && (
          <div className="sticky top-0 z-30">
            <Navbar
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 bg-gray-900 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
  showNavbar = true,
}: AppLayoutProps) {
  return (
    <ToastProvider>
      <AppProvider>
        <AppLayoutContent showNavbar={showNavbar}>{children}</AppLayoutContent>
      </AppProvider>
    </ToastProvider>
  );
}
