import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.prodotgroup.com',
      },
    ],
  },
};

export default nextConfig;
