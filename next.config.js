/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cos.**.myqcloud.com', // 腾讯云 COS
      },
      {
        protocol: 'https',
        hostname: '**.myqcloud.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
