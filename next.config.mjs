/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The theme ships its own pre-built CSS/JS and images in /public
  images: { unoptimized: true },
  async headers() {
    return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }];
  },
};

export default nextConfig;
