import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from "@/lib/constants";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Get the base URL for metadata - use production URL by default, localhost in dev
import { getBaseUrl } from '@/lib/url-utils';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Animal Welfare Tracker | UK Voters for Animals",
  description: "Tracking government progress on animal welfare commitments across the UK. An independent monitoring initiative by UK Voters for Animals.",
  keywords: ["animal welfare", "UK", "government", "policy", "animals", "welfare laws", "animal rights", "commitments", "tracker"],
  authors: [{ name: "UK Voters for Animals" }],
  creator: "UK Voters for Animals",
  publisher: "UK Voters for Animals",
  openGraph: {
    title: "Animal Welfare Tracker | UK Voters for Animals",
    description: "Tracking government progress on animal welfare commitments across the UK.",
    type: "website",
    siteName: "Animal Welfare Tracker",
    images: [
      {
        url: "/icon_dark.svg",
        width: 400,
        height: 400,
        alt: "Animal Welfare Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Welfare Tracker",
    description: "Tracking government progress on animal welfare commitments across the UK.",
    images: [
      {
        url: "/icon_dark.svg",
        alt: "Animal Welfare Tracker logo",
      },
    ],
    ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
    ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
        className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
