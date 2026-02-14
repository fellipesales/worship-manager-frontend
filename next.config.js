/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    if (!apiUrl) return [];

    return [
      // Proxy /api/* to backend, EXCEPT /api/auth/* (handled by NextAuth locally)
      {
        source: '/api/:path((?!auth/).*)',
        destination: `${apiUrl}/api/:path*`,
      },
      // Proxy /auth/* to backend (register, token, etc.)
      {
        source: '/auth/:path*',
        destination: `${apiUrl}/auth/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
