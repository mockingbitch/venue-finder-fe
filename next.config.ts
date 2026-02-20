import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['react-leaflet', 'react-leaflet-markercluster'],
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
