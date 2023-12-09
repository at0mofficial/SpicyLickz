/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['yt3.ggpht.com','lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
