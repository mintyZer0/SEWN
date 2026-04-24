type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getClientIp(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const cf = headerList.get("cf-connecting-ip");
  if (cf) return cf;

  const real = headerList.get("x-real-ip");
  if (real) return real;

  return "unknown";
}

function now() {
  return Date.now();
}

export function checkRateLimit(
  headerList: Headers,
  action: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
  const ip = getClientIp(headerList);
  const key = `${action}:${ip}`;
  const ts = now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= ts) {
    const next = { count: 1, resetAt: ts + windowMs };
    buckets.set(key, next);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  buckets.set(key, current);
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
