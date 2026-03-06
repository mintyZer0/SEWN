import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qgniaasqnjzvfjximawh.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/public/**',   
      },
    ],
  },
}

module.exports = nextConfig