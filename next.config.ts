import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/media",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(svg|jpg|jpeg|png|webp|avif|gif|ico|mp4|webm|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
