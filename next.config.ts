import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora pacotes nativos que causam "module not found" ou crashes misteriosos 
  // no Webpack durante a build server-side na Vercel:
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client", "@prisma/client"],
};

export default nextConfig;
