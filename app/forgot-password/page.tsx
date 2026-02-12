'use client'

/**
 * PAGE MOT DE PASSE OUBLIÉ
 */

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <Card glow className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <CardTitle className="mb-2">Email envoyé !</CardTitle>
            <CardDescription>
              Vérifiez votre boîte mail. Nous vous avons envoyé un lien pour réinitialiser votre mot de passe.
            </CardDescription>
            <div className="mt-6">
              <Link href="/login">
                <Button variant="secondary" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-dark"></div>
      
      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-block p-4 bg-accent-yellow/10 rounded-2xl border border-accent-yellow/20 mb-4 hover:scale-105 transition-transform">
            <span className="text-5xl">🔑</span>
          </Link>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Mot de passe oublié ?
          </h1>
          <p className="text-text-secondary">
            Pas de souci, on va vous aider
          </p>
        </div>

        <Card glow>
          <CardHeader>
            <CardTitle>Réinitialisation</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
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

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                isLoading={loading}
                className="w-full"
              >
                Envoyer le lien
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-center text-sm text-text-secondary w-full">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link 
                href="/login" 
                className="text-accent-yellow hover:text-accent-yellow-light font-semibold transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
