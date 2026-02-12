'use client'

/**
 * PAGE DE CONNEXION - DESIGN SOMBRE
 */

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      router.push(`/${profile.role}`)
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-dark"></div>
      
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-accent-yellow/10 rounded-2xl border border-accent-yellow/20 mb-4 glow-yellow">
            <span className="text-5xl">🧱</span>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            MG Inventory
          </h1>
          <p className="text-text-secondary">
            Système de gestion commerciale
          </p>
        </div>

        {/* Carte de connexion */}
        <Card glow>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour continuer
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <Input
                type="email"
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />

              {/* Mot de passe */}
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {/* Mot de passe oublié */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-accent-yellow hover:text-accent-yellow-light transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Bouton de connexion */}
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                isLoading={loading}
                className="w-full"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-text-secondary w-full">
              Pas encore de compte ?{' '}
              <Link 
                href="/register" 
                className="text-accent-yellow hover:text-accent-yellow-light font-semibold transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Comptes de test (à retirer en production) */}
        <div className="mt-6 glass-container p-4">
          <p className="text-xs text-text-secondary text-center mb-2">Comptes de test :</p>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="badge-yellow">admin@mg.com</span>
            <span className="badge-yellow">gerant@mg.com</span>
            <span className="badge-yellow">revendeur@mg.com</span>
          </div>
          <p className="text-xs text-text-muted text-center mt-2">
            Mot de passe : password123
          </p>
        </div>
      </div>
    </div>
  )
}
