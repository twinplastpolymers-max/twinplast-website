import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side
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
 * Server Actions, or Route Handlers (Server-only).
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
