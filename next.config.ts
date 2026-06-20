import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: "/fornitori-vibes/:slug*",
        destination: "https://www.vibesplanner.com/vetrine/:slug*",
        permanent: true
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/sitemap-index.xml"
        }
      ]
    };
  }
};

export default nextConfig;
