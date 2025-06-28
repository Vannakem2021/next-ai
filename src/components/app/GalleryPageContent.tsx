"use client";

import Gallery from "@/components/app/Gallery";
import { useAppContext } from "@/contexts/AppContext";

export default function GalleryPageContent() {
  const { generatedImages, isLoadingImages, handleImageDeleted } =
    useAppContext();
  return (
    <Gallery
      images={generatedImages}
      isLoading={isLoadingImages}
      onImageDeleted={handleImageDeleted}
    />
  );
}
