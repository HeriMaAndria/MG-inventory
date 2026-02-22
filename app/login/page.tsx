'use client'

/**
 * PAGE LOGIN
 * Utilise mockAuth (localStorage)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth/mockAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { user, error } = await login(formData.email, formData.password)

      if (error || !user) {
        setError(error || 'Erreur de connexion')
        setLoading(false)
        return
      }

      // Redirection selon le rôle
      if (user.role === 'admin') {
        router.push('/admin')
      } else if (user.role === 'gerant') {
        router.push('/gerant')
      } else if (user.role === 'revendeur') {
        router.push('/revendeur')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl">🧱</span>
          </div>
          <CardTitle className="text-center">MG Inventory</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              name="password"
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="text-sm text-text-muted">
              <p>Comptes de test :</p>
              <ul className="mt-2 space-y-1">
                <li>• admin@mg.com / password123</li>
                <li>• gerant@mg.com / password123</li>
                <li>• revendeur@mg.com / password123</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" isLoading={loading}>
              Se connecter
            </Button>

            <div className="text-center text-sm text-text-secondary">
              <Link href="/" className="hover:text-accent-yellow transition-colors">
                Retour à l'accueil
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
