import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RevendeurDashboard() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'revendeur') {
    redirect('/login')
  }

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Revendeur</h1>
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mes clients</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devis en cours</p>
                <p className="text-3xl font-bold text-gray-900">5</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CA du mois</p>
                <p className="text-3xl font-bold text-gray-900">12,450€</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ✅ Accès Revendeur
          </h2>
          <p className="text-gray-700">
            Vous pouvez gérer vos clients, créer des devis et appliquer votre marge commerciale.
          </p>
        </div>
      </main>
    </div>
  )
}
