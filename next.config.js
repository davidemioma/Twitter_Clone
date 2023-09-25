/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  staticPageGenerationTimeout: 180,
};

module.exports = nextConfig;
