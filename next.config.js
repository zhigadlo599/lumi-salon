const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    qualities: [75, 80, 85, 90],
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "@mui/icons-material"],
  },
};

module.exports = nextConfig;
