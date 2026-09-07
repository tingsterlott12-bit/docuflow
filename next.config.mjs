/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // PageFlip DOM manipulation requires single init
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist', '@napi-rs/canvas'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
