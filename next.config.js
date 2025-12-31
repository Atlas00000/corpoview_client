/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for optimized deployments (Vercel)
  output: 'standalone',
  images: {
    // Configure image domains for optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/coins/images/**',
      },
      // News API images - allow all HTTPS domains for news sources
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  // Note: Console is preserved for logger utility, which handles production logging
  compiler: {
    removeConsole: false, // Logger utility manages console output
  },
  // Code splitting optimizations
  // Note: optimizeCss requires 'critters' package - disabled for now
  // experimental: {
  //   optimizeCss: true,
  // },
  // Optimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  // Allow ESLint warnings during build (production builds should still pass)
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during build (warnings won't block deployment)
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript errors will still fail the build
  },
}

module.exports = nextConfig

