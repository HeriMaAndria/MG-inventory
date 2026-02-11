'use client'

/**
 * PAGE D'ACCÈS REFUSÉ (403) - DARK MODE VERT
 * 
 * Version personnalisée avec :
 * - Thème sombre professionnel
 * - Couleur verte
 * - Animations interactives
 * - Messages personnalisés
 */

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function AccessDenied() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (err) {
      console.error('Erreur déconnexion:', err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 relative overflow-hidden">
      {/* Effet de glow rouge-vert en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Carte principale */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 relative overflow-hidden">
          {/* Barre supérieure colorée */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
          
          <div className="relative">
            {/* Icône de cadenas avec animation */}
            <div className="text-center mb-6">
              <div className="mx-auto relative">
                {/* Anneaux pulsants */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-yellow-500/30 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-orange-500/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Icône principale */}
                <div className="relative flex items-center justify-center h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-xl shadow-yellow-500/30 animate-pulse">
                  <svg
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Titre avec dégradé */}
              <h1 className="text-3xl font-bold mt-6 mb-2">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Accès refusé
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Vous n'avez pas les permissions nécessaires
              </p>
            </div>

            {/* Message détaillé avec icône */}
            <div className="bg-gray-900/50 border border-yellow-500/20 rounded-xl p-5 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-200 mb-1">
                    Code d'erreur : 403 Forbidden
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Cette page est réservée aux utilisateurs avec des droits spécifiques. 
                    Contactez un administrateur si vous pensez que c'est une erreur.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions avec animations */}
            <div className="space-y-3">
              {/* Bouton retour */}
              <button
                onClick={() => router.back()}
                className="w-full group bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Retour
                </div>
              </button>

              {/* Bouton accueil */}
              <button
                onClick={() => router.push('/')}
                className="w-full group bg-gray-700 text-gray-200 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02] border border-gray-600 hover:border-green-500/50"
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
                  Aller à l'accueil
                </div>
              </button>

              {/* Bouton déconnexion avec loading */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full group relative bg-gray-900 text-gray-300 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-green-500 mr-2"></div>
                    Déconnexion en cours...
                  </div>
                ) : (
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Se déconnecter
                  </div>
                )}
              </button>
            </div>

            {/* Message de contact */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p>Besoin d'aide ? Contactez un administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-500/40 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-orange-500/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-red-500/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  )
}
