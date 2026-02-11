import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * DASHBOARD ADMIN
 * 
 * Cette page est accessible uniquement aux admins.
 * C'est un Server Component (pas de 'use client').
 * 
 * SÉCURITÉ :
 * - Vérifie la session côté serveur
 * - Vérifie le rôle dans la base de données
 * - Si pas admin → redirige
 */

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Vérifie l'authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Vérifie le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/login')
  }

  // Fonction de déconnexion (à appeler via un formulaire)
  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Bienvenue, {profile.full_name || user.email}</p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte 1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gérants</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="text-4xl">🧑‍💼</div>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revendeurs</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="text-4xl">🧑‍💻</div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ✅ Authentification fonctionnelle
          </h2>
          <p className="text-gray-700">
            Vous êtes connecté en tant qu'administrateur. Le système de rôles fonctionne correctement.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Prochaine étape : Implémenter la gestion des utilisateurs
          </p>
        </div>
      </main>
    </div>
  )
}
