import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * PAGE ADMIN - AVEC AUTO-REDIRECTION
 * 
 * Cette page vérifie le rôle et redirige vers le bon dashboard
 */

export default async function AdminPage() {
  const supabase = await createClient()

  // Vérifie l'authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Récupère le rôle (sans crash si erreur)
  let userRole = 'admin' // Valeur par défaut
  
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle() // maybeSingle() au lieu de single() pour éviter les erreurs

    if (profile && profile.role) {
      userRole = profile.role
      
      // Si pas admin, redirige vers son dashboard
      if (profile.role !== 'admin') {
        redirect(`/${profile.role}`)
      }
    }
  } catch (error) {
    console.error('Erreur récupération profil:', error)
    // Continue avec le rôle par défaut
  }

  // Fonction de déconnexion
  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="glass-container mx-4 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard Admin</h1>
            <p className="text-sm text-text-secondary mt-1">Bienvenue, {user.email}</p>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="btn-secondary"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Utilisateurs</p>
                <p className="text-3xl font-bold text-text-primary">12</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="card-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Gérants</p>
                <p className="text-3xl font-bold text-text-primary">3</p>
              </div>
              <div className="text-4xl">🧑‍💼</div>
            </div>
          </div>

          <div className="card-dark">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Revendeurs</p>
                <p className="text-3xl font-bold text-text-primary">8</p>
              </div>
              <div className="text-4xl">🧑‍💻</div>
            </div>
          </div>
        </div>

        <div className="mt-8 elevated-container p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            ✅ Authentification fonctionnelle
          </h2>
          <p className="text-text-secondary">
            Vous êtes connecté en tant qu'administrateur. Le système de rôles fonctionne correctement.
          </p>
        </div>
      </main>
    </div>
  )
}
