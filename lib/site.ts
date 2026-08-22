export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://twinplastpolymers.com';

/**
 * Returns a fully-qualified URL using the NEXT_PUBLIC_SITE_URL environment variable.
 * @param path Optional relative path (e.g., '/products/pp-corrugated-sheets')
 */
export function getSiteUrl(path: string = ''): string {
  const basePath = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
  if (!path) return basePath;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
