import { useAuth, useUser } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";

export function useAdminAuth() {
  const { isLoaded, userId, has } = useAuth();
  const { user } = useUser();

  // Use Clerk's role key format (org:role_name) - memoized for stability
  const roleChecks = useMemo(() => {
    if (!isLoaded || !has) {
      return {
        isAdmin: false,
        isSuperAdmin: false,
        isModerator: false,
        hasModeratorRole: false,
        hasAdminRole: false,
        hasSuperAdminRole: false,
      };
    }

    const hasModeratorRole = Boolean(has({ role: "org:moderator" }));
    const hasAdminRole = Boolean(has({ role: "org:admin" }));
    const hasSuperAdminRole = Boolean(has({ role: "org:super_admin" }));

    return {
      isAdmin: hasAdminRole || hasSuperAdminRole,
      isSuperAdmin: hasSuperAdminRole,
      isModerator: hasModeratorRole || hasAdminRole || hasSuperAdminRole,
      hasModeratorRole,
      hasAdminRole,
      hasSuperAdminRole,
    };
  }, [isLoaded, has]);

  // Stable permission check function
  const hasPermission = useCallback(
    (requiredRole: "moderator" | "admin" | "super_admin"): boolean => {
      if (!isLoaded || !userId) {
        return false;
      }

      const {
        hasModeratorRole,
        hasAdminRole,
        hasSuperAdminRole,
        isAdmin,
        isSuperAdmin,
      } = roleChecks;

      // Check if user has any admin role
      const hasAnyRole = hasModeratorRole || hasAdminRole || hasSuperAdminRole;

      // If user has any admin role, check specific permissions
      if (hasAnyRole) {
        switch (requiredRole) {
          case "moderator":
            return Boolean(hasModeratorRole || isAdmin);
          case "admin":
            return Boolean(hasAdminRole || isSuperAdmin);
          case "super_admin":
            return Boolean(hasSuperAdminRole);
          default:
            return false;
        }
      }

      // No admin roles found - deny access
      return false;
    },
    [isLoaded, userId, roleChecks]
  );

  return {
    isLoaded,
    userId,
    user,
    isAdmin: roleChecks.isAdmin,
    isSuperAdmin: roleChecks.isSuperAdmin,
    isModerator: roleChecks.isModerator,
    hasPermission,
  };
}
