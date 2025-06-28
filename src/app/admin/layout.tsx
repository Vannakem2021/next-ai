"use client";

import AdminProtection from "@/components/admin/AdminProtection";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtection requiredRole="moderator">
      <div className="h-screen bg-gray-900 flex overflow-hidden">
        {/* Fixed Sidebar - Hidden on mobile, visible on desktop */}
        <div className="fixed left-0 top-0 h-full z-30 hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Fixed Header */}
          <div className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-gray-800">
            <AdminHeader />
          </div>

          {/* Scrollable Content */}
          <main
            className="flex-1 p-4 lg:p-6 pb-8 overflow-y-auto h-screen"
            style={{ paddingTop: "120px" }}
          >
            <div className="max-w-full min-h-full">{children}</div>
          </main>
        </div>
      </div>
    </AdminProtection>
  );
}
