import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useAPI, UserProfile } from "@/lib/api";
import { userProfileCache } from "@/lib/userCache";

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateCredits: (availableCredits: number, usedCredits: number) => void;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const { isLoaded, isSignedIn, user } = useUser();
  const api = useAPI();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle Clerk loading state
  useEffect(() => {
    if (!isLoaded) {
      setLoading(true);
    }
  }, [isLoaded]);

  const fetchUserProfile = useCallback(async () => {
    if (!isSignedIn || !isLoaded) return;

    try {
      setLoading(true);
      setError(null);
      const profile = await api.getUserProfile();
      setUserProfile(profile);
      userProfileCache.set(profile);
    } catch (err) {
      // Only set error if we don't have cached data
      if (!userProfile) {
        setError(
          err instanceof Error ? err.message : "Failed to load user data"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, isLoaded, api, userProfile]);

  // Silent fetch for background updates (doesn't show loading state)
  const fetchUserProfileSilently = useCallback(async () => {
    if (!isSignedIn || !isLoaded) return;

    try {
      const profile = await api.getUserProfile();
      setUserProfile(profile);
      userProfileCache.set(profile);
    } catch {
      // Don't update error state for silent fetches
    }
  }, [isSignedIn, isLoaded, api]);

  // Initialize with cached data immediately
  useEffect(() => {
    if (!hasInitialized && isLoaded && isSignedIn) {
      const cachedProfile = userProfileCache.get();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
        setLoading(false); // We have cached data, stop loading
        setHasInitialized(true);
        // Still fetch fresh data in background, but don't show loading
        fetchUserProfileSilently();
      } else {
        setHasInitialized(true);
        fetchUserProfile(); // This will set loading to true and then false when done
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    user?.id,
    hasInitialized,
    fetchUserProfile,
    fetchUserProfileSilently,
  ]);

  const refetch = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const updateCredits = useCallback(
    (availableCredits: number, usedCredits: number) => {
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          available_credits: availableCredits,
          used_credits: usedCredits,
        };
        setUserProfile(updatedProfile);
        userProfileCache.updateCredits(availableCredits, usedCredits);
      }
    },
    [userProfile]
  );

  // Clear cache when user signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      userProfileCache.clear();
      setUserProfile(null);
      setError(null);
      setLoading(false);
      setHasInitialized(false);
    }
  }, [isLoaded, isSignedIn]);

  return {
    userProfile,
    loading,
    error,
    refetch,
    updateCredits,
  };
};
