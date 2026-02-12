/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour production sur Vercel
  images: {
    domains: [], // Ajoute les domaines d'images externes ici
  },
  
  // Désactiver les avertissements sur les variables d'environnement manquantes en build
  // Car elles seront injectées par Vercel au runtime
  eslint: {
    ignoreDuringBuilds: false, // Garde ESLint actif
  },
  typescript: {
    ignoreBuildErrors: false, // Garde TypeScript strict
  },

  // Optimisations
  swcMinify: true, // Utilise SWC pour la minification (plus rapide)
  
  // Configuration des Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
