import type { NextConfig } from "next";
import { LEGACY_PRODUCT_SLUG_REDIRECTS } from "./lib/products";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/site.webmanifest',
        destination: '/manifest.webmanifest',
        permanent: true,
      },
      ...LEGACY_PRODUCT_SLUG_REDIRECTS,
    ];
  },
};

export default nextConfig;
