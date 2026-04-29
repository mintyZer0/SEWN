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

interface CacheEntry {
  url: string;
  expiry: number;
}

const mediaCache = new Map<string, CacheEntry>();
const PENDING_PROMISES = new Map<string, Promise<string>>();

export async function getPrivateMediaUrl(privateUrl: string | null | undefined): Promise<string> {
  if (!privateUrl || !privateUrl.startsWith("s3-private://")) return privateUrl || "";

  const now = Date.now();
  const cached = mediaCache.get(privateUrl);

  if (cached && cached.expiry > now) {
    return cached.url;
  }

  // Prevent multiple simultaneous fetches for the same URL
  if (PENDING_PROMISES.has(privateUrl)) {
    return PENDING_PROMISES.get(privateUrl)!;
  }

  const fetchPromise = (async () => {
    const filename = privateUrl.replace("s3-private://", "").replace(/^\/+/, "");
    
    const res = await fetch(`/api/media?filename=${encodeURIComponent(filename)}&bucketType=private`, {
      method: "GET",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get signed URL");

    // Cache for 55 minutes (S3 presigned URLs usually last 60 mins)
    mediaCache.set(privateUrl, {
      url: data.url,
      expiry: now + 55 * 60 * 1000
    });

    return data.url;
  })();

  PENDING_PROMISES.set(privateUrl, fetchPromise);

  try {
    const url = await fetchPromise;
    return url;
  } finally {
    PENDING_PROMISES.delete(privateUrl);
  }
}
