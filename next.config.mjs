/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack configuration (Next.js 16 default)
  turbopack: {
    // Set the root directory to silence workspace root detection warning
    root: process.cwd(),
  },
};

export default nextConfig;
