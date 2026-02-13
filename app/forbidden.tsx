/**
 * PAGE 403 - ACCÈS INTERDIT
 * Thème sombre (#0a0a0a) + Jaune (#fbbf24)
 */

import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Effet de glow en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#fbbf24]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Grand 403 avec effet néon */}
        <div className="mb-8 relative">
          <h1 className="text-[10rem] font-black leading-none select-none">
            <span className="bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              403
            </span>
          </h1>
          
          {/* Icône de cadenas au centre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Cercle pulsant */}
              <div className="absolute inset-0 bg-[#fbbf24]/20 rounded-full animate-ping"></div>
              
              {/* Icône cadenas */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#fbbf24]/50 rounded-full p-6 shadow-2xl shadow-[#fbbf24]/20">
                <svg className="w-16 h-16 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-8 mb-6">
          {/* Titre */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Accès interdit
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette ressource
          </p>

          {/* Raisons possibles */}
          <div className="bg-[#0a0a0a]/50 border border-[#fbbf24]/20 rounded-xl p-6 mb-6 text-left">
            <p className="text-sm text-gray-400 mb-3">Raisons possibles :</p>
            
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
              </div>
              <p className="text-sm text-gray-300">Vous n'êtes pas connecté à votre compte</p>
            </div>
            
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
              </div>
              <p className="text-sm text-gray-300">Votre compte n'a pas les droits d'accès</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></div>
              </div>
              <p className="text-sm text-gray-300">Cette ressource nécessite une autorisation spéciale</p>
            </div>
          </div>

          {/* Boutons d'action avec animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/login"
              className="group relative bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0a0a] py-4 px-6 rounded-xl font-semibold hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50"
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
                Se connecter
              </div>
            </Link>
            
            <Link
              href="/"
              className="group bg-gray-800 text-gray-200 py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700 hover:border-[#fbbf24]/50"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Accueil
              </div>
            </Link>
          </div>
        </div>

        {/* Message de support */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Besoin d'accès ? Contactez un administrateur</p>
        </div>
      </div>

      {/* Particules décoratives animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#fbbf24]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-[#f59e0b]/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-[#fcd34d]/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
