'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { SkeletonCard, LoadingButton, InlineLoader } from '@/app/components/Loading'

/**
 * DASHBOARD ADMIN - VERSION CLIENT AVEC LOADING STATES
 * 
 * Cette version utilise 'use client' pour démontrer les loading states.
 * En production, vous pouvez combiner Server + Client Components.
 * 
 * Loading states présents :
 * ✅ Skeleton loaders pour les cartes
 * ✅ Loading button pour déconnexion
 * ✅ Loader pour la liste d'utilisateurs
 */

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export default function AdminDashboardImproved() {
  const router = useRouter()
  const supabase = createClient()

  // États
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalUsers: 0,
    gerants: 0,
    revendeurs: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // États pour la liste des utilisateurs
  const [users, setUsers] = useState<UserProfile[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

  /**
   * Charge les données au montage du composant
   */
  useEffect(() => {
    loadUserData()
    loadStats()
    loadUsers()
  }, [])

  /**
   * Charge les données de l'utilisateur connecté
   */
  const loadUserData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'admin') {
        router.push('/login')
        return
      }

      setUser(user)
      setProfile(profile)
    } catch (err) {
      console.error('Erreur chargement utilisateur:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Charge les statistiques
   */
  const loadStats = async () => {
    try {
      // Compte total d'utilisateurs
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Compte les gérants
      const { count: gerants } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'gerant')

      // Compte les revendeurs
      const { count: revendeurs } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'revendeur')

      setStats({
        totalUsers: totalUsers || 0,
        gerants: gerants || 0,
        revendeurs: revendeurs || 0,
      })
    } catch (err) {
      console.error('Erreur chargement stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  /**
   * Charge la liste des utilisateurs
   */
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setUsers(data || [])
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err)
    } finally {
      setUsersLoading(false)
    }
  }

  /**
   * Déconnexion
   */
  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (err) {
      console.error('Erreur déconnexion:', err)
      setLogoutLoading(false)
    }
  }

  // ✅ Loading state principal
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-1">
              Bienvenue, {profile?.full_name || user?.email}
            </p>
          </div>
          
          {/* ✅ Bouton de déconnexion avec loading */}
          <LoadingButton
            onClick={handleLogout}
            loading={logoutLoading}
            variant="danger"
          >
            Déconnexion
          </LoadingButton>
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ✅ Skeleton loaders pendant le chargement */}
          {statsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Carte 1 */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </div>

              {/* Carte 2 */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gérants</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.gerants}</p>
                  </div>
                  <div className="text-4xl">🧑‍💼</div>
                </div>
              </div>

              {/* Carte 3 */}
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revendeurs</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.revendeurs}</p>
                  </div>
                  <div className="text-4xl">🧑‍💻</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Liste des utilisateurs récents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Utilisateurs récents</h2>
          </div>
          
          <div className="p-6">
            {/* ✅ Loader pour la liste */}
            {usersLoading ? (
              <InlineLoader text="Chargement des utilisateurs..." />
            ) : users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun utilisateur</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                      ${user.role === 'gerant' ? 'bg-blue-100 text-blue-800' : ''}
                      ${user.role === 'revendeur' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
