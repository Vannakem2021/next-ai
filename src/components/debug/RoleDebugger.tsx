"use client";

import { useAuth, useUser, useOrganizationList } from "@clerk/nextjs";
import { useState } from "react";

export default function RoleDebugger() {
  const { isLoaded, userId, has, orgId, orgRole, orgSlug } = useAuth();
  const { user } = useUser();
  const { userMemberships, isLoaded: orgsLoaded } = useOrganizationList();
  const [showDebug, setShowDebug] = useState(false);

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  const checkRole = (role: string) => {
    try {
      return has ? has({ role }) : false;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const checkPermission = (permission: string) => {
    try {
      return has ? has({ permission }) : false;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
      >
        🐛 Debug Roles
      </button>

      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-gray-800 border border-gray-600 rounded-lg p-4 w-96 max-h-96 overflow-y-auto text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">Role Debug Info</h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* User Info */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">User Info:</h4>
              <div className="text-gray-300">
                <div>ID: {userId}</div>
                <div>Email: {user.emailAddresses[0]?.emailAddress}</div>
                <div>
                  Name: {user.firstName} {user.lastName}
                </div>
              </div>
            </div>

            {/* Current Organization */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">
                Current Org:
              </h4>
              <div className="text-gray-300">
                <div>Org ID: {orgId || "None"}</div>
                <div>Org Role: {orgRole || "None"}</div>
                <div>Org Slug: {orgSlug || "None"}</div>
              </div>
            </div>

            {/* Organizations List */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">
                All Organizations:
              </h4>
              <div className="text-gray-300">
                {orgsLoaded ? (
                  userMemberships &&
                  userMemberships.data &&
                  userMemberships.data.length > 0 ? (
                    userMemberships.data.map((membership) => (
                      <div
                        key={membership.organization.id}
                        className="mb-2 p-1 bg-gray-600 rounded"
                      >
                        <div>Name: {membership.organization.name}</div>
                        <div>ID: {membership.organization.id}</div>
                        <div>Role: {membership.role}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-red-400">No organizations found</div>
                  )
                ) : (
                  <div>Loading organizations...</div>
                )}
              </div>
            </div>

            {/* Role Checks */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">
                Role Checks:
              </h4>
              <div className="text-gray-300 space-y-1">
                <div>org:admin: {String(checkRole("org:admin"))}</div>
                <div>org:moderator: {String(checkRole("org:moderator"))}</div>
                <div>
                  org:super_admin: {String(checkRole("org:super_admin"))}
                </div>
                <div>admin: {String(checkRole("admin"))}</div>
                <div>moderator: {String(checkRole("moderator"))}</div>
              </div>
            </div>

            {/* Permission Checks */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">
                Permission Checks:
              </h4>
              <div className="text-gray-300 space-y-1">
                <div>admin:read: {String(checkPermission("admin:read"))}</div>
                <div>admin:write: {String(checkPermission("admin:write"))}</div>
                <div>
                  org:admin:read: {String(checkPermission("org:admin:read"))}
                </div>
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-gray-700 p-2 rounded">
              <h4 className="text-yellow-400 font-semibold mb-1">
                Environment:
              </h4>
              <div className="text-gray-300">
                <div>Domain: {window.location.hostname}</div>
                <div>
                  Clerk Key:{" "}
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(
                    0,
                    20
                  )}
                  ...
                </div>
                <div>
                  Is Production:{" "}
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith(
                    "pk_live_"
                  )
                    ? "Yes"
                    : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
