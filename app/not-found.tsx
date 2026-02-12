/**
 * PAGE 404 - DARK MODE VERT
 * 
 * Version personnalisée avec :
 * - Thème sombre élégant
 * - Couleur verte
 * - Animations fluides
 * - Logo personnalisé
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 relative overflow-hidden">
      {/* Effet de glow en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Grand 404 avec effet néon */}
        <div className="mb-8 relative">
          <h1 className="text-[12rem] font-black leading-none select-none">
            <span className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              404
            </span>
          </h1>
          
          {/* Logo/Icône animée au centre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Cercle pulsant */}
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              
              {/* Logo MG */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-green-500/50 rounded-full p-6 shadow-2xl shadow-green-500/20">
                <div className="text-5xl">🧱</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8 mb-6">
          {/* Titre */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Page introuvable
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            La page que vous cherchez n'existe pas ou a été déplacée
          </p>

          {/* Suggestions avec icônes */}
          <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-300">Vérifiez l'URL dans la barre d'adresse</p>
            </div>
            
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-300">Utilisez le menu de navigation</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-300">Retournez à la page d'accueil</p>
            </div>
          </div>

          {/* Boutons d'action avec animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
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
            
            <Link
              href="/login"
              className="group bg-gray-700 text-gray-200 py-4 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02] border border-gray-600 hover:border-green-500/50"
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
                Connexion
              </div>
            </Link>
          </div>
        </div>

        {/* Message de support */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Besoin d'aide ? Contactez le support technique</p>
        </div>
      </div>

      {/* Particules décoratives animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-emerald-500/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-green-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-green-300/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  )
}
