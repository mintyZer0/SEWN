import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qgniaasqnjzvfjximawh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // In Next.js 15.2.3+ and 16, this is a top-level config for HMR security
  allowedDevOrigins: [
    "sewist.sewn.local:3000",
    "sewn.local:3000",
    "admin.sewn.local:3000",
    "sewist.sewn.local",
    "sewn.local",
    "admin.sewn.local",
    "localhost:3000",
  ],
};

export default nextConfig;
