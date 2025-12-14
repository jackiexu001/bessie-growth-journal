/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 支持多个云存储的图片域名
    domains: [
      'localhost',
      'res.cloudinary.com', // Cloudinary
      // Cloudflare R2 和腾讯云 COS 使用远程模式，支持所有域名
    ],
    // 使用远程模式支持 R2 和 COS（通过 remotePatterns）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.dev', // Cloudflare R2 公开域名
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com', // Cloudflare R2 存储域名
      },
      {
        protocol: 'https',
        hostname: '**.cos.**.myqcloud.com', // 腾讯云 COS
      },
    ],
    unoptimized: false,
  },
  // 支持大文件上传
  serverRuntimeConfig: {
    maxFileSize: '1024mb',
  },
  // 实验性功能：优化图片加载
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig

