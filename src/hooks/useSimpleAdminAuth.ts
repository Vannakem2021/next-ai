import { useAuth, useUser } from "@clerk/nextjs";
import { useMemo } from "react";

// Temporary admin check based on email addresses
// Use this as a fallback if organization roles aren't working
const ADMIN_EMAILS = [
  "vannakem312@gmail.com", // Your admin email
  // Add more admin emails as needed
];

export function useSimpleAdminAuth() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  const isAdmin = useMemo(() => {
    if (!isLoaded || !user || !userId) {
      return false;
    }

    // Check if user's email is in the admin list
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    return userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
  }, [isLoaded, user, userId]);

  return {
    isLoaded,
    userId,
    user,
    isAdmin,
    isSuperAdmin: isAdmin, // For simplicity, treat all admins as super admins
    isModerator: isAdmin,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasPermission: (_role?: string) => isAdmin, // Simple permission check that accepts optional role parameter
  };
}
