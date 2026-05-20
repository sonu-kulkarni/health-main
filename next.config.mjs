/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.qrserver.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
