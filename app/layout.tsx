import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: {
    template: "%s | Learn The Web",
    default: "Learn The Web",
  },
  description:
    "A collection of docs, tutorials and resources to learn web development.",
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
