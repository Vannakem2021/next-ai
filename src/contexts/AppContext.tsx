"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  useAPI,
  GeneratedImage,
  convertStoredImageToGeneratedImage,
  getImageDimensions,
  UserProfile,
} from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { useRouter, usePathname } from "next/navigation";

interface AppContextType {
  // Images state
  generatedImages: GeneratedImage[];
  isLoadingImages: boolean;

  // Generation state
  isGenerating: boolean;
  handleGenerate: (
    prompt: string,
    aspectRatio: string,
    batchSize: number,
    advancedSettings?: {
      steps: number;
      seed: number | null;
      negativePrompt: string;
    }
  ) => Promise<void>;

  // Image management
  handleImageDeleted: (imageId: string) => void;

  // User state
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // UI state
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  const { userProfile, loading, error, updateCredits } = useUserProfile();
  const api = useAPI();
  const { showError, showSuccess } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Load user's persisted images
  const loadImages = useCallback(async () => {
    if (!isSignedIn || !isLoaded) {
      setIsLoadingImages(false);
      return;
    }

    try {
      setIsLoadingImages(true);
      const response = await api.getUserImages(50, 0); // Load first 50 images
      const convertedImages = response.images.map(
        convertStoredImageToGeneratedImage
      );
      setGeneratedImages(convertedImages);
    } catch (error) {
      // Don't show error toast for empty image list - it's normal for new users
      if (error instanceof Error && !error.message.includes("404")) {
        showError("Failed to load your images");
      }
    } finally {
      setIsLoadingImages(false);
    }
  }, [isSignedIn, isLoaded, api, showError]);

  // Load images when user is authenticated
  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Generate image function
  const handleGenerate = async (
    prompt: string,
    aspectRatio: string,
    batchSize: number,
    advancedSettings?: {
      steps: number;
      seed: number | null;
      negativePrompt: string;
    }
  ) => {
    setIsGenerating(true);
    try {
      console.log("Generating image:", {
        prompt,
        aspectRatio,
        batchSize,
        advancedSettings,
      });

      // Get dimensions from aspect ratio
      const { width, height } = getImageDimensions(aspectRatio);

      // Generate images based on batch size
      const generatedImages: GeneratedImage[] = [];

      for (let i = 0; i < batchSize; i++) {
        const requestId = `gen_${Date.now()}_${i}`;

        const response = await api.generateImage({
          prompt,
          width,
          height,
          steps: advancedSettings?.steps || 4, // Use advanced steps or default
          request_id: requestId,
          ...(advancedSettings?.seed && { seed: advancedSettings.seed }),
          ...(advancedSettings?.negativePrompt && {
            negative_prompt: advancedSettings.negativePrompt,
          }),
        });

        if (response.success && response.images.length > 0) {
          // Convert base64 data URL to blob URL for better performance
          const base64Data = response.images[0];
          const imageUrl = base64Data.startsWith("data:")
            ? base64Data
            : `data:image/png;base64,${base64Data}`;

          const newImage: GeneratedImage = {
            id: `${Date.now()}_${i}`,
            url: imageUrl,
            prompt,
            aspectRatio,
            createdAt: new Date().toISOString(),
            isLiked: false,
            width: response.metadata.width || width,
            height: response.metadata.height || height,
            model: response.metadata.model || "PicLumen Art V1",
            seed:
              response.metadata.seed || Math.floor(Math.random() * 100000000),
            guidanceScale: 1, // Default guidance scale
            steps: response.metadata.steps || 20,
          };

          generatedImages.push(newImage);

          // Update user credits after successful generation
          if (response.user_info) {
            updateCredits(
              response.user_info.remaining_credits,
              response.user_info.total_credits -
                response.user_info.remaining_credits
            );
          }
        }
      }

      // Add all generated images to the state
      if (generatedImages.length > 0) {
        setGeneratedImages((prev) => [...generatedImages, ...prev]);
        showSuccess(
          "Images Generated!",
          `Successfully generated ${generatedImages.length} image${
            generatedImages.length > 1 ? "s" : ""
          }`
        );

        // Navigate to create page if not already there
        if (pathname !== "/app" && pathname !== "/app/create") {
          router.push("/app/create");
        }
      }
    } catch (error) {
      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate image";

      // Show toast notification for error
      showError("Generation Failed", errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle image deletion
  const handleImageDeleted = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const value: AppContextType = {
    generatedImages,
    isLoadingImages,
    isGenerating,
    handleGenerate,
    handleImageDeleted,
    userProfile,
    loading,
    error,
    isSidebarOpen,
    setIsSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
