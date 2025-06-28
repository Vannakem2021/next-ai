import { useAuth } from "@clerk/nextjs";
import { useCallback, useMemo } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Admin API Types
export interface AdminUser {
  id: string;
  clerk_user_id: string;
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
  suspendedBy?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  adminNotes?: string;
}

export interface UserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  bonusCredits: number;
  discountPercentage: number;
  features: Record<string, unknown>;
  active: boolean;
  createdAt: string;
  totalSales: number;
  totalRevenue: number;
}

export interface AnalyticsOverview {
  total_users: number;
  active_users: number;
  total_images: number;
  total_revenue: number;
  credits_issued: number;
  credits_used: number;
  growth_metrics: {
    newUsers: number;
    userGrowthRate: number;
    period: string;
  };
}

export interface ContentItem {
  id: string;
  imageId: string;
  prompt: string;
  imageUrl: string;
  width: number;
  height: number;
  flagType: string;
  flagReason?: string;
  status: "pending" | "approved" | "rejected";
  userEmail: string;
  userName: string;
  createdAt: string;
  imageCreatedAt: string;
  reviewedAt?: string;
}

export interface ContentListResponse {
  content: ContentItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Admin API Client
export function useAdminAPI() {
  const { getToken } = useAuth();

  const makeRequest = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      try {
        let token = await getToken();

        // Development fallback: check for test JWT token in localStorage
        if (!token && typeof window !== "undefined") {
          const testToken = localStorage.getItem("test_jwt_token");
          if (testToken) {
            token = testToken;
          }
        }

        if (!token) {
          throw new Error(
            "Authentication required. Please sign in to access admin features."
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/v1/admin${endpoint}`,
          {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              ...options.headers,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (response.status === 401) {
            throw new Error("Authentication failed. Please sign in again.");
          }

          if (response.status === 403) {
            throw new Error("Access denied. Admin privileges required.");
          }

          if (response.status === 404) {
            throw new Error(
              "Admin endpoint not found. Please check if the backend is running."
            );
          }

          throw new Error(
            errorData.detail ||
              `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        // Re-throw with more context
        if (error instanceof TypeError && error.message.includes("fetch")) {
          throw new Error(
            "Cannot connect to backend API. Please ensure the backend server is running on http://localhost:8000"
          );
        }

        throw error;
      }
    },
    [getToken]
  );

  // User Management
  const getUsers = useCallback(
    async (
      page: number = 1,
      limit: number = 50,
      search?: string,
      status?: string
    ): Promise<UserListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (status && status !== "all") params.append("status", status);

      return makeRequest(`/users?${params}`);
    },
    [makeRequest]
  );

  const getUserDetails = useCallback(
    async (userId: string) => {
      return makeRequest(`/users/${userId}`);
    },
    [makeRequest]
  );

  const performUserAction = useCallback(
    async (
      userId: string,
      action: {
        action:
          | "suspend"
          | "unsuspend"
          | "delete"
          | "adjust_credits"
          | "add_note";
        reason?: string;
        credits_adjustment?: number;
        note?: string;
      }
    ): Promise<AdminActionResponse> => {
      return makeRequest(`/users/${userId}/actions`, {
        method: "POST",
        body: JSON.stringify(action),
      });
    },
    [makeRequest]
  );

  // Credit Management
  const getCreditPackages = useCallback(async () => {
    return makeRequest("/credits/packages");
  }, [makeRequest]);

  const createCreditPackage = useCallback(
    async (packageData: {
      name: string;
      description: string;
      price: number;
      credits: number;
      bonus_credits?: number;
      discount_percentage?: number;
      features?: Record<string, unknown>;
      active?: boolean;
    }): Promise<AdminActionResponse> => {
      return makeRequest("/credits/packages", {
        method: "POST",
        body: JSON.stringify(packageData),
      });
    },
    [makeRequest]
  );

  const updateCreditPackage = useCallback(
    async (
      packageId: string,
      packageData: Partial<{
        name: string;
        description: string;
        price: number;
        credits: number;
        bonus_credits: number;
        discount_percentage: number;
        features: Record<string, unknown>;
        active: boolean;
      }>
    ): Promise<AdminActionResponse> => {
      return makeRequest(`/credits/packages/${packageId}`, {
        method: "PUT",
        body: JSON.stringify(packageData),
      });
    },
    [makeRequest]
  );

  // Content Moderation
  const getContentForModeration = useCallback(
    async (
      page: number = 1,
      limit: number = 50,
      status?: string,
      flagType?: string
    ): Promise<ContentListResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status && status !== "all") params.append("status", status);
      if (flagType && flagType !== "all") params.append("flag_type", flagType);

      return makeRequest(`/content?${params}`);
    },
    [makeRequest]
  );

  const flagContent = useCallback(
    async (
      contentId: string,
      flag: {
        image_id: string;
        flag_type: "inappropriate" | "copyright" | "spam" | "other";
        flag_reason?: string;
      }
    ): Promise<AdminActionResponse> => {
      return makeRequest(`/content/${contentId}/flag`, {
        method: "POST",
        body: JSON.stringify(flag),
      });
    },
    [makeRequest]
  );

  const reviewFlaggedContent = useCallback(
    async (
      flagId: string,
      action: {
        action: "approve" | "reject" | "remove";
        reason?: string;
      }
    ): Promise<AdminActionResponse> => {
      return makeRequest(`/content/flags/${flagId}/review`, {
        method: "POST",
        body: JSON.stringify(action),
      });
    },
    [makeRequest]
  );

  // Analytics
  const getAnalyticsOverview = useCallback(
    async (days: number = 30): Promise<AnalyticsOverview> => {
      return makeRequest(`/analytics/overview?days=${days}`);
    },
    [makeRequest]
  );

  const getRecentActivity = useCallback(
    async (limit: number = 20) => {
      return makeRequest(`/recent-activity?limit=${limit}`);
    },
    [makeRequest]
  );

  const getDetailedAnalytics = useCallback(
    async (days: number = 30) => {
      return makeRequest(`/analytics/detailed?days=${days}`);
    },
    [makeRequest]
  );

  // Content Management
  const getContentList = useCallback(
    async (
      params: {
        page?: number;
        limit?: number;
        status?: string;
        flagType?: string;
        search?: string;
      } = {}
    ) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.flagType) queryParams.append("flagType", params.flagType);
      if (params.search) queryParams.append("search", params.search);

      return makeRequest(`/content?${queryParams.toString()}`);
    },
    [makeRequest]
  );

  // System
  const getSystemHealth = useCallback(async () => {
    return makeRequest("/system/health");
  }, [makeRequest]);

  const getAuditLog = useCallback(
    async (page: number = 1, limit: number = 100) => {
      return makeRequest(`/audit-log?page=${page}&limit=${limit}`);
    },
    [makeRequest]
  );

  return useMemo(
    () => ({
      // User Management
      getUsers,
      getUserDetails,
      performUserAction,

      // Credit Management
      getCreditPackages,
      createCreditPackage,
      updateCreditPackage,

      // Content Moderation
      getContentForModeration,
      flagContent,
      reviewFlaggedContent,

      // Analytics
      getAnalyticsOverview,
      getDetailedAnalytics,
      getRecentActivity,

      // Content Management
      getContentList,

      // System
      getSystemHealth,
      getAuditLog,
    }),
    [
      getUsers,
      getUserDetails,
      performUserAction,
      getCreditPackages,
      createCreditPackage,
      updateCreditPackage,
      getContentForModeration,
      flagContent,
      reviewFlaggedContent,
      getAnalyticsOverview,
      getDetailedAnalytics,
      getRecentActivity,
      getContentList,
      getSystemHealth,
      getAuditLog,
    ]
  );
}
