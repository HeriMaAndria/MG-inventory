'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'
import { LoadingButton, PageLoader } from '@/app/components/Loading'

/**
 * PAGE DE CONNEXION - VERSION AMÉLIORÉE
 * 
 * Améliorations :
 * ✅ Loading states sur le bouton
 * ✅ Validation des champs
 * ✅ Messages d'erreur clairs
 * ✅ Loader pendant l'initialisation
 */

export default function LoginPage() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  // États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Validation en temps réel
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  /**
   * Initialise le client Supabase uniquement côté client
   */
  useEffect(() => {
    setSupabase(createClient())
  }, [])

  /**
   * Validation de l'email
   */
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('L\'email est requis')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Email invalide')
      return false
    }
    setEmailError('')
    return true
  }

  /**
   * Validation du mot de passe
   */
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Le mot de passe est requis')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }
    setPasswordError('')
    return true
  }

  /**
   * Fonction appelée quand le formulaire est soumis
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Client Supabase non initialisé')
      return
    }

    // Validation avant soumission
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setError('')
    setLoading(true) // ✅ Active le loading state

    try {
      // 1. Connexion à Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Message d'erreur générique pour la sécurité
        throw new Error('Email ou mot de passe incorrect')
      }

      // 2. Récupère le rôle
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        throw new Error('Erreur lors de la récupération du profil')
      }

      // 3. Redirige
      router.push(`/${profile.role}`)

    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false) // ✅ Désactive le loading state
    }
  }

  // ✅ Affiche un loader pendant l'initialisation
  if (!supabase) {
    return <PageLoader message="Initialisation..." />
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
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) validateEmail(e.target.value)
              }}
              onBlur={() => validateEmail(email)}
              required
              className={`
                w-full px-4 py-2 border rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${emailError ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="votre@email.com"
            />
            {/* ✅ Message d'erreur validation */}
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
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
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) validatePassword(e.target.value)
              }}
              onBlur={() => validatePassword(password)}
              required
              className={`
                w-full px-4 py-2 border rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${passwordError ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="••••••••"
            />
            {/* ✅ Message d'erreur validation */}
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Message d'erreur global */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ✅ Bouton avec loading state */}
          <LoadingButton
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full"
          >
            Se connecter
          </LoadingButton>
        </form>

        {/* Info développement - À RETIRER EN PRODUCTION */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Comptes de test :</p>
            <p className="text-xs mt-1">admin@mg.com / gerant@mg.com / revendeur@mg.com</p>
          </div>
        )}
      </div>
    </div>
  )
}
