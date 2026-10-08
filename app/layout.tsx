import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL, getSiteUrl } from "@/lib/site";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Twinplast Polymers PVT LTD | PP Sheet Manufacturer in Tamil Nadu",
    template: "%s | Twinplast Polymers PVT LTD",
  },
  description:
    "Twinplast Polymers PVT LTD is a PP sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
  authors: [{ name: "Twinplast Polymers PVT LTD", url: getSiteUrl("/") }],
  creator: "Twinplast Polymers PVT LTD",
  publisher: "Twinplast Polymers PVT LTD",
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
    siteName: "Twinplast Polymers PVT LTD",
    locale: "en_IN",
    url: getSiteUrl("/"),
    title: "Twinplast Polymers PVT LTD | PP Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers PVT LTD is a PP sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
    images: [
      {
        url: getSiteUrl("/logo.png"),
        width: 572,
        height: 436,
        alt: "Twinplast Polymers PVT LTD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twinplast Polymers PVT LTD | PP Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers PVT LTD is a PP sheet manufacturer and supplier in Tamil Nadu, specializing in PP corrugated sheets, layer pads, hollow sheets, Sunpack sheets and customized polypropylene products.",
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
