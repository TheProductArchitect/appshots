import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const BASE_URL = "https://theproductarchitect.github.io/appshots";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "AppShots — Free App Store Screenshot Generator",
    template: "%s | AppShots",
  },

  description:
    "Generate professional App Store and Google Play Store screenshots for free. " +
    "Bulk upload app screenshots, add iPhone, Android, and iPad device frames, " +
    "customize text and backgrounds, then download all sizes in one click. " +
    "No sign-up. No backend. Runs entirely in your browser.",

  keywords: [
    "app store screenshot generator",
    "play store screenshot generator",
    "app store screenshot maker",
    "free app store screenshots",
    "ios screenshot generator",
    "android screenshot generator",
    "ipad screenshot generator",
    "app mockup generator",
    "app store asset generator",
    "screenshot framer",
    "app preview generator",
    "device frame generator",
    "app store creative tool",
    "google play screenshot maker",
    "app store images generator",
  ],

  authors: [{ name: "AppShots", url: BASE_URL }],
  creator: "AppShots",
  publisher: "AppShots",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "AppShots",
    title: "AppShots — Free App Store Screenshot Generator",
    description:
      "Generate professional App Store and Google Play screenshots for free. " +
      "iPhone, Android & iPad sizes. Runs entirely in your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AppShots — Free App Store Screenshot Generator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AppShots — Free App Store Screenshot Generator",
    description:
      "Bulk-generate App Store & Play Store screenshots for free. " +
      "iPhone, Android, iPad. No sign-up needed.",
    images: ["/og-image.png"],
    creator: "@TheProductArchitect",
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

  alternates: {
    canonical: BASE_URL,
  },

  // Allows AI agents and search crawlers explicit access
  other: {
    "theme-color": "#ffffff",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AppShots",
  url: BASE_URL,
  description:
    "Free App Store and Google Play Store screenshot generator. " +
    "Upload app screenshots, add device frames for iPhone, Android, and iPad, " +
    "customize text and backgrounds, and download all sizes as a ZIP.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Bulk screenshot upload",
    "iPhone App Store screenshot sizes",
    "Android Google Play screenshot sizes",
    "iPad screenshot sizes",
    "Custom background colors and gradients",
    "Custom background images",
    "Device frame mockups",
    "Screenshot position and zoom control",
    "One-click ZIP download",
    "Zero backend — runs in the browser",
  ],
  screenshot: `${BASE_URL}/og-image.png`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-charcoal bg-white">
        {children}
      </body>
    </html>
  );
}
