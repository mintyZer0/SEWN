import { getSafeOriginFromHeaders } from "@/lib/security/request";

function parseOrigin(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isSameOriginRequest(headerList: Headers): boolean {
  const safeOrigin = getSafeOriginFromHeaders(headerList);
  const safeOriginParsed = parseOrigin(safeOrigin);
  if (!safeOriginParsed) return false;

  const origin = parseOrigin(headerList.get("origin"));
  if (origin) return origin === safeOriginParsed;

  const referer = parseOrigin(headerList.get("referer"));
  if (referer) return referer === safeOriginParsed;

  return false;
}
