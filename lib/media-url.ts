export function resolvePublicMediaUrl(path: string | null | undefined): string {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const s3Bucket = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BUCKET;
  const s3Region = process.env.NEXT_PUBLIC_AWS_REGION || "ap-southeast-2";

  // Public media keys stored in S3 (products, product-images, avatars) should resolve to S3 URL.
  if (
    s3Bucket &&
    (normalizedPath === "default.jpg" ||
      normalizedPath.startsWith("products/") ||
      normalizedPath.startsWith("product-images/") ||
      normalizedPath.startsWith("avatars/"))
  ) {
    return `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${normalizedPath}`;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${normalizedPath}`;
  }

  return `/${normalizedPath}`;
}
