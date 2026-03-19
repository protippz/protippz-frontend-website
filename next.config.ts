import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: '10.10.20.9',
    //     port: '5000',
    //   },
    //   {
    //     protocol: 'http',
    //     hostname: '10.0.60.137',
    //     port: '5050',
    //   },
    //   {
    //     protocol: 'http',
    //     hostname: '10.0.60.37',
    //     port: '5050',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'api.protippz.com',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'protippz-bucket.s3.us-east-2.amazonaws.com',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'dsuotz3idqy4q.cloudfront.net',
    //   },
    // ],
    unoptimized: true
  },

};

export default nextConfig;
