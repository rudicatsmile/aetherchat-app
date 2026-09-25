import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "AetherChat — Chatbot AI Modern Bergaya Grok",
    template: "%s | AetherChat",
  },
  description:
    "Aplikasi chatbot AI modern berbasis web dengan antarmuka minimalis bergaya Grok, streaming respons super cepat, manajemen riwayat lengkap, dan fleksibilitas multi-model.",
  keywords: [
    "AI Chat",
    "AetherChat",
    "Grok UI",
    "Next.js AI",
    "Groq Llama 3.3",
    "OpenAI GPT-4o",
    "Chatbot Indonesia",
    "BYOK AI",
  ],
  authors: [{ name: "AetherChat Team" }],
  creator: "AetherChat",
  publisher: "AetherChat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AetherChat — Chatbot AI Modern Bergaya Grok",
    description:
      "Streaming respons super cepat bertenaga Groq Llama 3.3 dan OpenAI dengan antarmuka minimalis bergaya Grok.",
    url: "/",
    siteName: "AetherChat",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AetherChat — Chatbot AI Modern Bergaya Grok",
    description:
      "Streaming respons super cepat bertenaga Groq Llama 3.3 dan OpenAI dengan antarmuka minimalis bergaya Grok.",
    creator: "@aetherchat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans selection:bg-primary/25 selection:text-white">
        {children}
      </body>
    </html>
  );
}
