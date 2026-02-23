import type { NextConfig } from 'next';

// Truyền env ra client (Next.js 15 đôi khi không inline NEXT_PUBLIC_ từ .env)
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8089/api',
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA ?? 'false',
  },
  transpilePackages: ['react-leaflet'],
  output: 'standalone',
  // Fast Refresh (hot reload) bật mặc định khi chạy next dev
  // Tắt để tránh double-mount gây lỗi "Map container is already initialized" (react-leaflet)
  reactStrictMode: false,
  // Bật polling khi chạy dev (Docker/WSL) để hot reload nhận thay đổi file
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = { poll: 1000, aggregateTimeout: 300 };
    }
    return config;
  },
};

export default nextConfig;
