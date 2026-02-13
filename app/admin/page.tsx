'use client'

import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth/mockAuth'
import ProtectedPage from '@/components/ProtectedPage'

export default function AdminPage() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedPage allowedRoles={['admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Dashboard Admin</h1>
              <p className="text-sm text-text-secondary mt-1">
                Bienvenue, {user?.name || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Utilisateurs</p>
                  <p className="text-3xl font-bold text-text-primary">3</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Gérants</p>
                  <p className="text-3xl font-bold text-text-primary">1</p>
                </div>
                <div className="text-4xl">🧑‍💼</div>
              </div>
            </div>

            <div className="card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Revendeurs</p>
                  <p className="text-3xl font-bold text-text-primary">1</p>
                </div>
                <div className="text-4xl">🧑‍💻</div>
              </div>
            </div>
          </div>

          <div className="mt-8 elevated-container p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
              🔧 Mode Démo (sans Supabase)
            </h2>
            <p className="text-text-secondary mb-4">
              Vous êtes connecté en mode démo. L'authentification utilise localStorage.
            </p>
            <div className="bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg p-4">
              <p className="text-sm text-accent-yellow">
                💡 Pour activer Supabase, configure les variables d'environnement dans Vercel :
                <br />
                - NEXT_PUBLIC_SUPABASE_URL
                <br />
                - NEXT_PUBLIC_SUPABASE_ANON_KEY
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedPage>
  )
}
