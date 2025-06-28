import { Metadata } from "next";
import AppLayout from "@/components/app/AppLayout";
import GalleryPageContent from "@/components/app/GalleryPageContent";

export const metadata: Metadata = {
  title: "Gallery - Creative Studio",
  description: "Browse and manage your AI-generated image collection",
};

export default function GalleryPage() {
  return (
    <AppLayout showNavbar={false}>
      <GalleryPageContent />
    </AppLayout>
  );
}
