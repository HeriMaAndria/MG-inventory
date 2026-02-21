/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // swcMinify est activé par défaut dans Next.js 15 - plus besoin de le spécifier
}

module.exports = nextConfig
