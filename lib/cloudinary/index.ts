/**
 * Get responsive, transformed delivery URLs from a Cloudinary public ID.
 * Safe for use in both Client and Server Components.
 * This file has NO server-side Node SDK imports to ensure it bundles safely on the client.
 */
export function getOptimizedImageUrl(
  publicId: string, 
  options: { 
    width?: number; 
    height?: number; 
    crop?: 'fill' | 'scale' | 'fit' | 'crop' | 'thumb'; 
    quality?: 'auto' | 'best' | 'good' | 'eco'; 
    sharpen?: boolean | number;
    upscale?: boolean;
  } = {}
): string {
  // If the identifier is already a full external image URL, return it directly as a fallback
  if (!publicId || publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'twinplast';
  const transformations: string[] = [];

  if (options.upscale) transformations.push('e_upscale');
  if (options.sharpen) {
    const amount = typeof options.sharpen === 'number' ? options.sharpen : 80;
    transformations.push(`e_sharpen:${amount}`);
  }
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  
  // Enforce performance best practices: auto format and quality
  const qVal = options.quality === 'best' ? 'auto:best' : (options.quality === 'good' ? 'auto:good' : (options.quality || 'auto'));
  transformations.push(`q_${qVal}`);
  transformations.push('f_auto');

  const transformPath = transformations.length > 0 ? transformations.join(',') : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformPath}/${publicId}`;
}
