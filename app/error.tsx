'use client'

/**
 * PAGE D'ERREUR GLOBALE - DARK MODE JAUNE
 * 
 * Version personnalisée avec :
 * - Thème sombre (#0a0a0a)
 * - Couleur principale : Jaune (#fbbf24)
 * - Animations fluides
 * - Messages personnalisés
 */

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur application:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4">
      <div className="max-w-md w-full">
        {/* Carte principale avec effet de glow */}
        <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800 p-8 relative overflow-hidden">
          {/* Effet de glow jaune en arrière-plan */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#fbbf24]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo animé avec effet pulsant */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] mb-4 animate-pulse shadow-lg shadow-[#fbbf24]/50">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              
              {/* Titre avec dégradé jaune */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent mb-3">
                Une erreur s'est produite
              </h1>
              <p className="text-gray-400 text-lg">
                Ne vous inquiétez pas, nous allons arranger ça
              </p>
            </div>

            {/* Message d'erreur technique (dev uniquement) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-[#0a0a0a] border border-[#fbbf24]/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono text-[#fbbf24] break-words">
                      {error.message}
                    </p>
                    {error.digest && (
                      <p className="text-xs text-gray-500 mt-2">
                        ID: {error.digest}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions avec animations au hover */}
            <div className="space-y-3">
              {/* Bouton réessayer */}
              <button
                onClick={reset}
                className="w-full group relative bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0a0a0a] py-3.5 px-4 rounded-xl font-semibold hover:from-[#fcd34d] hover:to-[#fbbf24] transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#fbbf24]/30 hover:shadow-[#fbbf24]/50"
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

              {/* Bouton retour à l'accueil */}
              <a
                href="/"
                className="block w-full group bg-gray-800 text-gray-200 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] border border-gray-700 hover:border-[#fbbf24]/50"
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
              </a>
            </div>

            {/* Info contact avec icône */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Problème persistant ? Contactez le support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#fbbf24] rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#f59e0b] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-[#fcd34d] rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </div>
  )
}
