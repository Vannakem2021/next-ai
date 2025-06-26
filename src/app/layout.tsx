import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Creative Studio - Create Stunning Visuals with AI Magic",
  description:
    "Transform your ideas into breathtaking images and videos with our cutting-edge AI platform. No design skills required – just pure creativity unleashed.",
  keywords: [
    "AI",
    "image generation",
    "video generation",
    "artificial intelligence",
    "creative tools",
    "digital art",
    "AI portraits",
    "code visualization",
  ],
  authors: [{ name: "Creative Studio" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: "Creative Studio - Create Stunning Visuals with AI Magic",
    description:
      "Transform your ideas into breathtaking images and videos with our cutting-edge AI platform. No design skills required – just pure creativity unleashed.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Studio - Create Stunning Visuals with AI Magic",
    description:
      "Transform your ideas into breathtaking images and videos with our cutting-edge AI platform. No design skills required – just pure creativity unleashed.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-gray-900 text-white min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
