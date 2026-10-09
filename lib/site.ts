const DEFAULT_SITE_URL = 'https://www.twinplastpolymers.com';

function normalizeBaseUrl(rawUrl?: string): string {
  if (!rawUrl || rawUrl.trim() === '') {
    return DEFAULT_SITE_URL;
  }

  let url = rawUrl.trim();

  // If running in production on Vercel or custom domain, always prioritize the canonical domain
  if (process.env.NODE_ENV === 'production' && !url.includes('localhost')) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Strip trailing slashes
  return url.replace(/\/+$/, '');
}

export const SITE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);

/**
 * Returns a fully-qualified URL using the canonical SITE_URL.
 * @param path Optional relative path (e.g., '/products/pp-corrugated-sheets')
 */
export function getSiteUrl(path: string = ''): string {
  const basePath = SITE_URL;
  if (!path) return basePath;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}

