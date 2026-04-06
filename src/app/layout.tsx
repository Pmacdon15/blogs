import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pat's Blogs",
  description: "A premium blog platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-background text-foreground">
        <ClerkProvider>
          <Providers>
            <div className="flex flex-col min-h-full">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Analytics />
            <Toaster theme="dark" />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
