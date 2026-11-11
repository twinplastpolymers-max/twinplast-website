import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL, getSiteUrl } from "@/lib/site";
import { BRAND_NAME, PRIMARY_SEO_POSITIONING } from "@/lib/seo";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  title: {
    default: `${BRAND_NAME} | ${PRIMARY_SEO_POSITIONING}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    "Twinplast Polymers is a PP Corrugated Sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
  authors: [{ name: BRAND_NAME, url: getSiteUrl("/") }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  alternates: {
    canonical: getSiteUrl("/"),
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Twinplast Polymers",
    locale: "en_IN",
    url: getSiteUrl("/"),
    title: "Twinplast Polymers | PP Corrugated Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers is a PP Corrugated Sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
    images: [
      {
        url: getSiteUrl("/logo.png"),
        width: 572,
        height: 436,
        alt: "Twinplast Polymers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twinplast Polymers | PP Corrugated Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers is a PP Corrugated Sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
    images: [getSiteUrl("/logo.png")],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
