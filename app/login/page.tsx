'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * PAGE DE CONNEXION
 * 
 * Cette page permet aux utilisateurs de se connecter.
 * 
 * FLUX :
 * 1. User entre email + mot de passe
 * 2. On appelle Supabase pour vérifier
 * 3. Si OK → récupère le rôle depuis la table profiles
 * 4. Redirige vers le dashboard correspondant
 * 
 * CONCEPTS :
 * - 'use client' = ce composant s'exécute côté navigateur
 * - useState = pour gérer l'état du formulaire
 * - async/await = pour les appels réseau
 */

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  // États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Fonction appelée quand le formulaire est soumis
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // Empêche le rechargement de la page
    setError('') // Reset les erreurs
    setLoading(true) // Affiche le loader

    try {
      // 1. Appel à Supabase pour se connecter
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // 2. Récupère le rôle de l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      // 3. Redirige vers le dashboard correspondant
      router.push(`/${profile.role}`)

    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🧱 MG Inventory</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Info développement */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Comptes de test :</p>
          <p className="text-xs mt-1">admin@mg.com / gerant@mg.com / revendeur@mg.com</p>
        </div>
      </div>
    </div>
  )
}
