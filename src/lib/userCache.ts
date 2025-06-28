import { UserProfile } from "./api";

const USER_PROFILE_KEY = "user_profile_cache";
const CACHE_EXPIRY_KEY = "user_profile_cache_expiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export interface CachedUserProfile {
  data: UserProfile;
  timestamp: number;
  expiresAt: number;
}

export class UserProfileCache {
  private static instance: UserProfileCache;
  private memoryCache: CachedUserProfile | null = null;

  static getInstance(): UserProfileCache {
    if (!UserProfileCache.instance) {
      UserProfileCache.instance = new UserProfileCache();
    }
    return UserProfileCache.instance;
  }

  /**
   * Get cached user profile from memory or localStorage
   */
  get(): UserProfile | null {
    // First check memory cache
    if (this.memoryCache && this.isValid(this.memoryCache)) {
      return this.memoryCache.data;
    }

    // Then check localStorage
    try {
      const cached = localStorage.getItem(USER_PROFILE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

      if (cached && expiry) {
        const cachedData: CachedUserProfile = JSON.parse(cached);

        if (this.isValid(cachedData)) {
          // Update memory cache
          this.memoryCache = cachedData;
          return cachedData.data;
        } else {
          // Clear expired cache
          this.clear();
        }
      }
    } catch {
      this.clear();
    }

    return null;
  }

  /**
   * Set user profile in both memory and localStorage
   */
  set(profile: UserProfile): void {
    const now = Date.now();
    const cachedProfile: CachedUserProfile = {
      data: profile,
      timestamp: now,
      expiresAt: now + CACHE_DURATION,
    };

    // Update memory cache
    this.memoryCache = cachedProfile;

    // Update localStorage
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(cachedProfile));
      localStorage.setItem(
        CACHE_EXPIRY_KEY,
        cachedProfile.expiresAt.toString()
      );
    } catch {
      // Silently fail cache operations
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    this.memoryCache = null;
    try {
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    } catch {
      // Silently fail cache operations
    }
  }

  /**
   * Check if cached data is still valid
   */
  private isValid(cached: CachedUserProfile): boolean {
    return Date.now() < cached.expiresAt;
  }

  /**
   * Check if cache exists and is valid without returning data
   */
  isValidCache(): boolean {
    if (this.memoryCache && this.isValid(this.memoryCache)) {
      return true;
    }

    try {
      const cached = localStorage.getItem(USER_PROFILE_KEY);
      if (cached) {
        const cachedData: CachedUserProfile = JSON.parse(cached);
        return this.isValid(cachedData);
      }
    } catch {
      // Silently fail cache operations
    }

    return false;
  }

  /**
   * Update specific fields in the cache (e.g., after credit usage)
   */
  updateCredits(availableCredits: number, usedCredits: number): void {
    if (this.memoryCache) {
      this.memoryCache.data.available_credits = availableCredits;
      this.memoryCache.data.used_credits = usedCredits;

      // Update localStorage as well
      try {
        localStorage.setItem(
          USER_PROFILE_KEY,
          JSON.stringify(this.memoryCache)
        );
      } catch {
        // Silently fail cache operations
      }
    }
  }
}

// Export singleton instance
export const userProfileCache = UserProfileCache.getInstance();
