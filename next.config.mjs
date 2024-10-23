const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  distDir: "dist",
  assetPrefix: isProd ? "/erastus-murungi.github.io/" : "",
  basePath: isProd ? "/erastus-murungi.github.io" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
