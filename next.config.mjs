/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The theme ships its own pre-built CSS/JS and images in /public
  images: { unoptimized: true },
  // /uploads/*: files in public/uploads are served directly; anything else falls
  // through to the disk-upload handler (self-hosted servers).
  async rewrites() {
    return { afterFiles: [{ source: '/uploads/:path*', destination: '/api/uploads/:path*' }] };
  },
  async headers() {
    return [{ source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] }];
  },
};

export default nextConfig;
