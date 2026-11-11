import type { MetadataRoute } from 'next';
import { BRAND_NAME, PRIMARY_SEO_POSITIONING } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} | ${PRIMARY_SEO_POSITIONING}`,
    short_name: BRAND_NAME,
    description:
      'Manufacturer of PP corrugated sheets, hollow sheets, Sunpack boards, layer pads, and floor protection rolls in Thoothukudi, Tamil Nadu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1464',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

