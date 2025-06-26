"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  useAPI,
  getImageDimensions,
  GeneratedImage,
  convertStoredImageToGeneratedImage,
} from "@/lib/api";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import Sidebar from "@/components/app/Sidebar";
import Navbar from "@/components/app/Navbar";
import ImageGrid from "@/components/app/ImageGrid";
import Gallery from "@/components/app/Gallery";

// No more mock data - we'll load real images from the API

function AppPageContent() {
  const { isLoaded, isSignedIn } = useUser();
  const { userProfile, loading, error, updateCredits } = useUserProfile();
  const api = useAPI();
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Load user's persisted images
  const loadImages = async () => {
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
      console.log(`Loaded ${convertedImages.length} persisted images`);
    } catch (error) {
      console.error("Failed to load images:", error);
      // Don't show error toast for empty image list - it's normal for new users
      if (error instanceof Error && !error.message.includes("404")) {
        showError("Failed to load your images");
      }
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Load images when user is authenticated
  useEffect(() => {
    console.log("Auth state changed:", { isSignedIn, isLoaded });
    loadImages();
  }, [isSignedIn, isLoaded, api]);

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

  // Generate image function
  const handleGenerate = async (
    prompt: string,
    aspectRatio: string,
    batchSize: number
  ) => {
    setIsGenerating(true);
    try {
      console.log("Generating image:", { prompt, aspectRatio, batchSize });

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
          steps: 4, // Default steps for fast generation
          request_id: requestId,
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
      }
    } catch (error) {
      console.error("Failed to generate image:", error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate image";

      // Show toast notification for error
      showError("Generation Failed", errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auth redirect with loop prevention
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Add a small delay to prevent rapid redirects
      const timer = setTimeout(() => {
        // Only redirect if we're still not signed in after the delay
        if (!isSignedIn) {
          window.location.href = "/auth";
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  // Only show loading for Clerk auth, not for profile data
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

  if (!isSignedIn) {
    return null; // Will redirect to auth
  }

  // Show error notification but don't block the entire UI
  // The error will be handled by the useUserProfile hook and shown in the sidebar

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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userProfile={userProfile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoading={loading}
        error={error}
      />

      {/* Main Content with left margin for sidebar */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-30">
          <Navbar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 bg-gray-900 overflow-y-auto">
          {activeTab === "create" ? (
            <ImageGrid images={generatedImages} isLoading={isLoadingImages} />
          ) : (
            <Gallery images={generatedImages} isLoading={isLoadingImages} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <ToastProvider>
      <AppPageContent />
    </ToastProvider>
  );
}
