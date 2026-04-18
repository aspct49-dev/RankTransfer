import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://ranktransfer.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f0b429",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RankTransfer — Transfer Your Roobet VIP Rank for Better Cashback",
    template: "%s | RankTransfer",
  },
  description:
    "Submit your Roobet wager stats and unlock better cashback offers up to 20%. Fast VIP rank transfer with instant Discord review. Free to apply.",
  keywords: [
    "Roobet VIP transfer",
    "Roobet cashback",
    "casino VIP rank transfer",
    "Roobet lossback",
    "Roobet affiliate",
    "casino cashback offer",
    "VIP gambling transfer",
    "Roobet promo",
  ],
  authors: [{ name: "RankTransfer" }],
  creator: "RankTransfer",
  publisher: "RankTransfer",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "RankTransfer",
    title: "RankTransfer — Transfer Your Roobet VIP Rank for Better Cashback",
    description:
      "Submit your Roobet wager stats and unlock up to 20% cashback. Fast, free, and secure VIP rank transfer service.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RankTransfer — VIP Rank Transfer Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RankTransfer — Better Roobet Cashback",
    description:
      "Transfer your Roobet VIP rank and unlock up to 20% cashback. Apply in under 2 minutes.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/rank_logo.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "RankTransfer",
              url: SITE_URL,
              description:
                "VIP rank transfer service for Roobet players. Submit your wager stats and receive better cashback offers.",
              potentialAction: {
                "@type": "SearchAction",
                target: SITE_URL,
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#0b0d1a" }}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1e",
              color: "#f0f0f0",
              border: "1px solid rgba(245,197,24,0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#f5c518", secondary: "#0d0d0f" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
