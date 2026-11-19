import type { NextConfig } from "next";

const securityHeaders = [
  // Clickjacking protection (legacy + modern)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
  // Force HTTPS for two years on this host
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Do not leak full URLs (which may include tokens / ids) to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful browser features the site does not use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  images: {
    // NOTE: wildcard hosts are kept for backwards compatibility with existing
    // image URLs stored in the backend. Narrow this list to the real hosts
    // (api.protippz.com, the CloudFront/S3 bucket, Google avatars, …) when possible.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    minimumCacheTTL: 86400,
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    // Required hardening when SVGs are allowed through the optimizer:
    // prevents scripts embedded in a remote SVG from executing.
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
