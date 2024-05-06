/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // This is for the tagging engine which is also serving the images
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5501",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
