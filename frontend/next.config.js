/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,

  // Redireciona /backend/* para o FastAPI sem o frontend precisar saber a porta
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://192.168.0.17:5050/:path*',
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
    BACKEND_URL: process.env.BACKEND_URL || 'http://192.168.0.17:5050',
  },
};

module.exports = nextConfig;