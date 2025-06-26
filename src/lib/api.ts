import { useAuth } from "@clerk/nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Utility function to convert aspect ratio to dimensions
export const getImageDimensions = (
  aspectRatio: string
): { width: number; height: number } => {
  switch (aspectRatio) {
    case "1:1":
      return { width: 1024, height: 1024 };
    case "3:4":
      return { width: 768, height: 1024 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "16:9":
      return { width: 1024, height: 576 };
    case "9:16":
      return { width: 576, height: 1024 };
    default:
      return { width: 1024, height: 1024 };
  }
};

// Utility function to calculate aspect ratio from dimensions
export const calculateAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;

  if (Math.abs(ratio - 1) < 0.1) return "1:1";
  if (Math.abs(ratio - 0.75) < 0.1) return "3:4";
  if (Math.abs(ratio - 1.33) < 0.1) return "4:3";
  if (Math.abs(ratio - 1.78) < 0.1) return "16:9";
  if (Math.abs(ratio - 0.56) < 0.1) return "9:16";

  return "1:1"; // Default fallback
};

// Utility function to convert StoredImage to GeneratedImage
export const convertStoredImageToGeneratedImage = (
  storedImage: StoredImage
): GeneratedImage => {
  const aspectRatio = calculateAspectRatio(
    storedImage.width,
    storedImage.height
  );

  return {
    id: storedImage.id,
    url: storedImage.access_url,
    prompt: storedImage.prompt,
    aspectRatio,
    createdAt: storedImage.created_at,
    isLiked: false, // We'll need to implement likes separately
    width: storedImage.width,
    height: storedImage.height,
    model: "PicLumen Art V1", // Default model name
    seed: undefined, // Not stored in current backend schema
    guidanceScale: 1, // Default value
    steps: 20, // Default value
  };
};

// Types for API responses
export interface UserProfile {
  clerk_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_id: string;
  total_credits: number;
  used_credits: number;
  available_credits: number;
  plan_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  credits: number;
  bonus_credits: number;
  discount_percentage: number;
  features?: Record<string, unknown>;
  active: boolean;
}

export interface ImageGenerationRequest {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  request_id?: string;
}

export interface ImageMetadata {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  model: string;
  processing_time_ms: number;
  workflow_type?: string;
}

export interface UserInfo {
  profile_id: string;
  credits_used: number;
  remaining_credits: number;
  total_credits: number;
  billing_model: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  images: string[]; // Array of base64 data URLs
  metadata: ImageMetadata;
  user_info: UserInfo;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  createdAt: string;
  isLiked: boolean;
  width?: number;
  height?: number;
  model?: string;
  seed?: number;
  guidanceScale?: number;
  steps?: number;
}

// Backend API response types for stored images
export interface StoredImage {
  id: string;
  filename: string;
  prompt: string;
  width: number;
  height: number;
  file_size_bytes: number;
  content_type: string;
  public: boolean;
  created_at: string;
  endpoint: string;
  credits_used: number;
  access_url: string;
  storage_type: string;
}

export interface UserImagesResponse {
  images: StoredImage[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
  user_id: string;
  timestamp: string;
}

// API client class
export class PicGenAPI {
  private getAuthHeaders = async (): Promise<Record<string, string>> => {
    // This will be called from components that have access to useAuth
    throw new Error("getAuthHeaders must be set before using API methods");
  };

  setAuthHeaders = (getToken: () => Promise<string | null>) => {
    this.getAuthHeaders = async () => {
      const token = await getToken();
      return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    };
  };

  // User endpoints
  async getUserProfile(): Promise<UserProfile> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/profile`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the nested backend response to match our flat frontend interface
    return {
      clerk_user_id: data.user.clerk_user_id,
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
      profile_id: data.user.profile_id,
      total_credits: data.credits.total_credits,
      used_credits: data.credits.used_credits,
      available_credits: data.credits.available_credits,
      plan_name: data.credits.billing_model || "Credit-Based",
      created_at: new Date().toISOString(), // Backend doesn't return this in profile endpoint
      updated_at: new Date().toISOString(), // Backend doesn't return this in profile endpoint
    };
  }

  async getUserHealth(): Promise<{
    status: string;
    user_id: string;
    available_credits: number;
  }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/users/health`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user health: ${response.statusText}`);
    }

    return response.json();
  }

  // Credit endpoints
  async getCreditPackages(): Promise<CreditPackage[]> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/credits/packages`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch credit packages: ${response.statusText}`
      );
    }

    return response.json();
  }

  async getCreditBalance(): Promise<{
    available_credits: number;
    total_credits: number;
    used_credits: number;
  }> {
    const headers = await this.getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/v1/credits/balance`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch credit balance: ${response.statusText}`);
    }

    return response.json();
  }

  // Image generation endpoints
  async generateImage(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResponse> {
    const headers = await this.getAuthHeaders();

    // Prepare the request body according to backend API spec
    const requestBody = {
      prompt: request.prompt,
      width: request.width || 1024,
      height: request.height || 1024,
      steps: request.steps || 4,
      ...(request.seed && { seed: request.seed }),
      ...(request.request_id && { request_id: request.request_id }),
    };

    const response = await fetch(`${API_BASE_URL}/api/v1/images/generate`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific error types from backend
      if (response.status === 402) {
        throw new Error(
          errorData.detail?.message ||
            "Insufficient credits for image generation"
        );
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (response.status === 500) {
        const detail = errorData.detail;
        if (typeof detail === "object" && detail.error) {
          throw new Error(detail.details || detail.error);
        }
        throw new Error(detail || "Image generation failed");
      }

      throw new Error(
        errorData.detail || `Failed to generate image: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Fetch user's generated images
  async getUserImages(
    limit: number = 20,
    offset: number = 0
  ): Promise<UserImagesResponse> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/users/images?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch images: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Create a singleton instance
export const apiClient = new PicGenAPI();

// Hook to use the API client with authentication
export const useAPI = () => {
  const { getToken } = useAuth();

  // Set up the auth headers when the hook is used
  if (getToken) {
    apiClient.setAuthHeaders(getToken);
  }

  return apiClient;
};
