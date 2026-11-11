import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

export const BRAND_NAME = 'Twinplast Polymers';
export const LEGAL_COMPANY_NAME = 'Twinplast Polymers Private Limited';
export const PRIMARY_SEO_POSITIONING = 'PP Corrugated Sheet Manufacturer in Tamil Nadu';

interface PublicMetadataOptions {
  /** Page-specific title segment (or full title when `absoluteTitle` is true). */
  title: string;
  description: string;
  path: string;
  /** Set true when `title` already includes the brand name so root `title.template` is not appended twice. */
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  imageUrl?: string;
  imageAlt?: string;
  twitterDescription?: string;
}

export function normalizeMetaDescription(text: string | null | undefined, maxLength = 160): string {
  const cleaned = (text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  if (cleaned.length <= maxLength) return cleaned;
  const sliced = cleaned.slice(0, maxLength - 3);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).trim()}...`;
}

export function normalizeBrandTitleSuffix(rawTitle: string): string {
  const cleaned = rawTitle
    .replace(/\s*\|\s*Twinplast\s+Polymers\s+(?:PVT\.?\s*LTD\.?|Private\s+Limited)\s*$/i, '')
    .replace(/\s*\|\s*Twinplast\s+Polymers\s*$/i, '')
    .replace(/\s*\|\s*Twinplast\s*$/i, '')
    .trim();
  return cleaned ? `${cleaned} | ${BRAND_NAME}` : BRAND_NAME;
}

export function buildPublicMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = 'website',
  imageUrl,
  imageAlt = BRAND_NAME,
  twitterDescription,
}: PublicMetadataOptions): Metadata {
  const canonicalUrl = getSiteUrl(path);
  const fullSocialTitle = absoluteTitle || title.endsWith(`| ${BRAND_NAME}`)
    ? title
    : `${title} | ${BRAND_NAME}`;
  const resolvedImage = imageUrl || getSiteUrl('/logo.png');
  const isDefaultLogo = !imageUrl;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullSocialTitle,
      description,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      locale: 'en_IN',
      type,
      images: [
        isDefaultLogo
          ? {
              url: resolvedImage,
              width: 572,
              height: 436,
              alt: imageAlt,
            }
          : {
              url: resolvedImage,
              alt: imageAlt,
            },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullSocialTitle,
      description: twitterDescription || description,
      images: [resolvedImage],
    },
  };
}

