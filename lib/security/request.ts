import { headers } from "next/headers";

const DEFAULT_LOCAL_HOST = "sewn.local:3000";
const LOCAL_HOST_PATTERNS = [
  /^localhost(?::\d+)?$/i,
  /^127(?:\.\d{1,3}){3}(?::\d+)?$/i,
  /^sewn\.local(?::\d+)?$/i,
  /^(?:admin|sewist)\.sewn\.local(?::\d+)?$/i,
];

function normalizeHost(host: string | null | undefined): string {
  return (host ?? "").trim().toLowerCase();
}

function getConfiguredSiteHost(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return null;

  try {
    return new URL(configured).host.toLowerCase();
  } catch {
    return null;
  }
}

function splitHost(host: string): { hostname: string; port: string } {
  const [hostname, port = ""] = host.split(":");
  return { hostname, port };
}

function isAllowedHost(host: string): boolean {
  if (!host) return false;

  if (LOCAL_HOST_PATTERNS.some((pattern) => pattern.test(host))) {
    return true;
  }

  const configuredHost = getConfiguredSiteHost();
  if (!configuredHost) return false;
  const requestHostParts = splitHost(host);
  const configuredHostParts = splitHost(configuredHost);

  const configuredRootHostname = configuredHostParts.hostname
    .replace(/^admin\./i, "")
    .replace(/^sewist\./i, "");

  const allowedHostnames = new Set([
    configuredRootHostname,
    `admin.${configuredRootHostname}`,
    `sewist.${configuredRootHostname}`,
  ]);

  if (!allowedHostnames.has(requestHostParts.hostname)) {
    return false;
  }

  return !configuredHostParts.port || requestHostParts.port === configuredHostParts.port;
}

function protocolForHost(host: string, forwardedProto: string | null): "http" | "https" {
  if (forwardedProto === "https" || forwardedProto === "http") {
    return forwardedProto;
  }

  const isLocal =
    host.includes("localhost") ||
    host.startsWith("127.") ||
    host.endsWith(".local") ||
    host.includes(".local:");

  return isLocal ? "http" : "https";
}

export function getSafeOriginFromHeaders(headerList: Headers): string {
  const host = normalizeHost(headerList.get("x-forwarded-host") ?? headerList.get("host"));
  const finalHost = isAllowedHost(host)
    ? host
    : getConfiguredSiteHost() ?? DEFAULT_LOCAL_HOST;
  const protocol = protocolForHost(finalHost, headerList.get("x-forwarded-proto"));

  return `${protocol}://${finalHost}`;
}

export async function getSafeOriginForCurrentRequest(): Promise<string> {
  const headerList = await headers();
  return getSafeOriginFromHeaders(headerList);
}

export function sanitizeRelativeRedirectPath(
  candidate: string | null | undefined,
  fallback = "/",
): string {
  if (!candidate) return fallback;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return fallback;
  if (candidate.includes("\n") || candidate.includes("\r")) return fallback;
  return candidate;
}
