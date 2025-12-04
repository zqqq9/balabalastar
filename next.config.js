const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    // 允许加载本地图片
    unoptimized: false,
  },
  // Optimize for development
  experimental: {
    // Reduce RSC payload size issues
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Optimize font loading
  optimizeFonts: true,
}

module.exports = withNextIntl(nextConfig);
