import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucas Dickey - Product Leader & Serial Founder",
  description:
    "20+ years as PM and product leader. Co-founder at Fernish ($45M raised), Founder at DeepCast, Former Amazon MP3 PM ($0 to $300M). Expert in 0→1 and 1→10 execution.",
  generator: "Lucas Dickey",
  metadataBase: new URL("https://lucas.cv"),
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      url: "/android-chrome-512x512.png",
    },
  ],

  // Open Graph metadata
  openGraph: {
    title: "Lucas Dickey - Product Leader & Serial Founder",
    description:
      "20+ years as PM and product leader. Co-founder at Fernish ($45M raised), Founder at DeepCast, Former Amazon MP3 PM ($0 to $300M). Expert in 0→1 and 1→10 execution.",
    url: "https://lucas.cv",
    siteName: "Lucas Dickey CV",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucas Dickey - Product Leader & Serial Founder",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Lucas Dickey - Product Leader & Serial Founder",
    description:
      "20+ years as PM and product leader. Co-founder at Fernish ($45M raised), Founder at DeepCast, Former Amazon MP3 PM ($0 to $300M). Expert in 0→1 and 1→10 execution.",
    images: ["/og-image.png"],
    creator: "@lucasdickey4",
    site: "@lucasdickey4",
  },

  // Additional metadata
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

  // Verification and additional tags
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code if needed
  },

  authors: [{ name: "Lucas Dickey", url: "https://lucas.cv" }],
  creator: "Lucas Dickey",
  publisher: "Lucas Dickey",

  keywords: [
    "Lucas Dickey",
    "Product Manager",
    "Product Leader",
    "Serial Founder",
    "Fernish",
    "DeepCast",
    "Amazon",
    "Startup Founder",
    "Technology Leader",
    "AI",
    "Machine Learning",
    "Venture Capital",
    "Angel Investor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RRM60KD28D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RRM60KD28D');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
