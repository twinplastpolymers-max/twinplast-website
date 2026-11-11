import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    absolute: `Admin Console Login | ${BRAND_NAME}`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

