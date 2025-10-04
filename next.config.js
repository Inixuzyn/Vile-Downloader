/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["tiktok.com", "instagram.com", "fbcdn.net", "scdn.co"],
  },
};

module.exports = nextConfig;
