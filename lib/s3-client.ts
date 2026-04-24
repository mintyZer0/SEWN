export function getS3PublicUrl(filePath: string | null | undefined): string {
  if (!filePath) return "";
  
  const bucket = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BUCKET;
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2";
  
  // If it's already an HTTP URL or a local path (starts with /), return it
  if (filePath.startsWith("http://") || filePath.startsWith("https://") || filePath.startsWith("/")) {
    return filePath;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${filePath}`;
}
