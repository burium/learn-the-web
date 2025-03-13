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
    "Your complete guide to web development. Learn the fundamentals, front-end, back-end, and advanced concepts with interactive tutorials and clear explanations.",
  metadataBase: baseUrl,
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth selection:bg-neutral-400/25`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="google-site-verification"
          content="mUdyJH0SN3fOxO2DT5J_kAtWgn0gRfUZX1svg6ZwXEY"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
