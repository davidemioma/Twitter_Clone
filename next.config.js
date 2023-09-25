/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
