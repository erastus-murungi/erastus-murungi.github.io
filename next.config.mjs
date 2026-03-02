/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nextjs.org",
      },
    ],
  },
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Set the root directory to silence workspace root detection warning
    root: process.cwd(),
  },
};

export default nextConfig;
