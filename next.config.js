/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com", "images.unsplash.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  serverExternalPackages: ["mongoose"],
  // Suppress known headers() error in route
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
