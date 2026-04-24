export function getS3PublicUrl(filePath: string): string {
  const bucket = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BUCKET;
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2";
  
  if (!filePath) return "";
  
  // If it's already an HTTP URL (like Google Maps or an old Supabase one we missed), return it
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  return `https://${bucket}.s3.${region}.amazonaws.com/${cleanPath}`;
}
