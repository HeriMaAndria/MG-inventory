/**
 * PAGE 500 - ERREUR SERVEUR
 * Thème sombre (#0a0a0a) + Jaune (#fbbf24)
 */

import Link from 'next/link'

export default function ServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Effet de glow en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Grand 500 avec effet néon */}
        <div className="mb-8 relative">
          <h1 className="text-[10rem] font-black leading-none select-none">
            <span className="bg-gradient-to-br from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              500
            </span>
          </h1>
          
          {/* Icône d'erreur au centre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Cercle pulsant */}
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              
              {/* Icône serveur */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-red-500/50 rounded-full p-6 shadow-2xl shadow-red-500/20">
                <svg className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-8 mb-6">
          {/* Titre */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Erreur serveur
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Une erreur inattendue s'est produite côté serveur. Notre équipe a été notifiée.
          </p>

          {/* Info technique */}
          <div className="bg-[#0a0a0a]/50 border border-red-500/20 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-300 mb-2">Que faire maintenant ?</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Rafraîchissez la page dans quelques instants</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vérifiez votre connexion internet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Si le problème persiste, contactez le support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Boutons d'action avec animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.reload()}
              className="group relative bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0a0a] py-4 px-6 rounded-xl font-semibold hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50"
            >
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Réessayer
              </div>
            </button>
            
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p>Code d'erreur : 500 - Internal Server Error</p>
        </div>
      </div>

      {/* Particules décoratives animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-red-600/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-red-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
