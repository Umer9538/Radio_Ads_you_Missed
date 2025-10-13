import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radio Ads You Missed | Never Miss a Radio Promotion Again",
  description: "Search, replay, and claim offers from New Zealand radio advertisements. Never miss a promotion, discount, or special offer mentioned on the radio.",
  keywords: ["radio ads", "New Zealand radio", "promotions", "discounts", "offers", "radio advertisements"],
  authors: [{ name: "Radio Ads You Missed" }],
  openGraph: {
    title: "Radio Ads You Missed",
    description: "Never miss a radio promotion again",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
