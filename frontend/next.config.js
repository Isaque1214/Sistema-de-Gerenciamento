/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Redireciona /api/* para o FastAPI sem o frontend precisar saber a porta
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      { source: '/home', destination: '/operacional', permanent: true },
    ];
  },

  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;