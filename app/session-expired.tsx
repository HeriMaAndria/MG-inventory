/**
 * PAGE SESSION EXPIRÉE
 * Thème sombre (#0a0a0a) + Jaune (#fbbf24)
 */

import Link from 'next/link'

export default function SessionExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Effet de glow en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Carte principale */}
        <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-8">
          {/* Icône horloge */}
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] mb-4 shadow-lg shadow-[#fbbf24]/50 relative">
              <svg
                className="h-12 w-12 text-[#0a0a0a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {/* Point pulsant */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Titre avec dégradé */}
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent">
                Session expirée
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Votre session a expiré pour des raisons de sécurité
            </p>
          </div>

          {/* Raisons */}
          <div className="bg-[#0a0a0a]/50 border border-[#fbbf24]/20 rounded-xl p-5 mb-6">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Raisons possibles :</p>
            
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start space-x-2">
                <span className="text-[#fbbf24] mt-0.5">•</span>
                <span>Inactivité prolongée (plus de 30 minutes)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#fbbf24] mt-0.5">•</span>
                <span>Connexion depuis un autre appareil</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#fbbf24] mt-0.5">•</span>
                <span>Mise à jour de sécurité du système</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full group relative bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0a0a] py-3.5 px-4 rounded-xl font-semibold hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50 block text-center"
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Se reconnecter
              </div>
            </Link>

            <Link
              href="/"
              className="w-full group bg-gray-800 text-gray-200 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700 hover:border-[#fbbf24]/50 block text-center"
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Retour à l'accueil
              </div>
            </Link>
          </div>

          {/* Info sécurité */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-400">
                <span className="text-blue-400 font-semibold">Note de sécurité :</span> L'expiration automatique des sessions protège votre compte contre les accès non autorisés.
              </p>
            </div>
          </div>
        </div>

        {/* Message de support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Problème de connexion ? <Link href="/support" className="text-[#fbbf24] hover:underline">Contactez le support</Link>
          </p>
        </div>
      </div>

      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#fbbf24] rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#f59e0b] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-[#fcd34d] rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
