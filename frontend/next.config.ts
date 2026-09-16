import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  serverExternalPackages: ["pino-pretty", "lokijs", "encoding"],
};

export default nextConfig;
