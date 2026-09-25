/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    // Inline the (small) global stylesheet so it doesn't block first paint.
    inlineCss: true,
  },
};

export default nextConfig;
