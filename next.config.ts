import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: "file:./dummy.db",
  },
};

export default nextConfig;
