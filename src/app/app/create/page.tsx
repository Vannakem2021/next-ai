import { Metadata } from "next";
import AppLayout from "@/components/app/AppLayout";
import CreatePageContent from "@/components/app/CreatePageContent";

export const metadata: Metadata = {
  title: "Create - Creative Studio",
  description:
    "Generate stunning AI images with our advanced image generation tools",
};

export default function CreatePage() {
  return (
    <AppLayout showNavbar={true}>
      <CreatePageContent />
    </AppLayout>
  );
}
