/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@haller/types", "@haller/supabase"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haller-immobilien.de",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
