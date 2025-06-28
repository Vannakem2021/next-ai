"use client";

import ImageGrid from "@/components/app/ImageGrid";
import { useAppContext } from "@/contexts/AppContext";

export default function CreatePageContent() {
  const { generatedImages, isLoadingImages, handleImageDeleted } =
    useAppContext();
  return (
    <ImageGrid
      images={generatedImages}
      isLoading={isLoadingImages}
      onImageDeleted={handleImageDeleted}
    />
  );
}
