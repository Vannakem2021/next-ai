import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Creative Studio - AI Image Generation Platform",
  description:
    "Transform your ideas into stunning visuals with our AI-powered image generation platform. Create professional-quality images from simple text prompts.",
  keywords: [
    "AI image generation",
    "text to image",
    "artificial intelligence",
    "creative tools",
    "digital art",
    "image creation",
    "AI art",
    "visual content",
  ],
  openGraph: {
    title: "Creative Studio - AI Image Generation Platform",
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation platform.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio - AI Image Generation Platform",
    description:
      "Transform your ideas into stunning visuals with our AI-powered image generation platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
