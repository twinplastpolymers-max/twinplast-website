import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
// We perform check in a safe wrapper to avoid breaking builds if variables are missing in Phase 1
if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

/**
 * Generate a server-side Cloudinary signature for secure, signed admin uploads.
 * This function must ONLY be imported and called inside Server Components, 
 * Server Actions, or Route Handlers.
 */
export function generateSignature(paramsToSign: Record<string, string | number | boolean>): { signature: string; timestamp: number } {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET is not configured on the server');
  }

  // Safely extract or generate the timestamp
  const timestamp = typeof paramsToSign['timestamp'] === 'number'
    ? paramsToSign['timestamp']
    : Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { ...paramsToSign, timestamp },
    apiSecret
  );

  return { signature, timestamp };
}

/**
 * Get responsive, transformed delivery URLs from a Cloudinary public ID.
 * Safe for use in both Client and Server Components.
 */
export function getOptimizedImageUrl(
  publicId: string, 
  options: { 
    width?: number; 
    height?: number; 
    crop?: 'fill' | 'scale' | 'fit' | 'crop' | 'thumb'; 
    quality?: 'auto' | 'best' | 'good' | 'eco'; 
  } = {}
): string {
  // If the identifier is already a full external image URL, return it directly as a fallback
  if (!publicId || publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  
  // Enforce performance best practices: auto format and quality
  transformations.push(`q_${options.quality || 'auto'}`);
  transformations.push('f_auto');

  const transformPath = transformations.length > 0 ? transformations.join(',') : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformPath}/${publicId}`;
}
