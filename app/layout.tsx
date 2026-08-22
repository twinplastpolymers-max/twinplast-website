import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL, getSiteUrl } from "@/lib/site";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

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
    default: "Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu",
    template: "%s | Twinplast Polymers",
  },
  description:
    "Twinplast Polymers Private Limited is a specialized B2B manufacturer of PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection, and Box sheets located in Thoothukudi, Tamil Nadu, India. Established in 2021.",
  alternates: {
    canonical: getSiteUrl("/"),
  },
  openGraph: {
    type: "website",
    siteName: "Twinplast Polymers",
    locale: "en_IN",
    url: getSiteUrl("/"),
    title: "Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers Private Limited manufactures high-quality PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection, and Box sheets in Thoothukudi, Tamil Nadu. Established in 2021.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twinplast Polymers | PP Sheet Manufacturer in Tamil Nadu",
    description:
      "Twinplast Polymers Private Limited manufactures high-quality PP Corrugated, Sunpack, Hollow, Layer Pad, Floor Protection, and Box sheets in Thoothukudi, Tamil Nadu. Established in 2021.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
