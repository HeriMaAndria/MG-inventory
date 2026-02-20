'use client'

import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth/mockAuth'
import ProtectedPage from '@/components/ProtectedPage'
import StatCard from '@/components/dashboard/StatCard'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedPage allowedRoles={['admin']}>
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-yellow/10 rounded-xl border border-accent-yellow/20">
                <span className="text-3xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Dashboard Administrateur
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  Bienvenue, {user?.name}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Utilisateurs actifs"
              value="24"
              icon="👥"
              trend={{ value: "+12% ce mois", positive: true }}
            />
            
            <StatCard
              title="Chiffre d'affaires"
              value="2.4M Ar"
              icon="💰"
              trend={{ value: "+23% ce mois", positive: true }}
              subtitle="vs mois dernier"
            />
            
            <StatCard
              title="Commandes"
              value="156"
              icon="📦"
              trend={{ value: "-5% ce mois", positive: false }}
            />
            
            <StatCard
              title="Stock total"
              value="1,234"
              icon="📊"
              subtitle="produits en stock"
            />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/users">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">👤</div>
                      <div>
                        <p className="font-semibold text-text-primary">Gérer les utilisateurs</p>
                        <p className="text-sm text-text-secondary">Ajouter, modifier, supprimer</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/settings">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">⚙️</div>
                      <div>
                        <p className="font-semibold text-text-primary">Paramètres</p>
                        <p className="text-sm text-text-secondary">Configuration système</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/admin/reports">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">📈</div>
                      <div>
                        <p className="font-semibold text-text-primary">Rapports</p>
                        <p className="text-sm text-text-secondary">Analyses détaillées</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'Gérant Test', action: 'a ajouté 15 produits au stock', time: 'Il y a 5 min', icon: '📦' },
                  { user: 'Revendeur Test', action: 'a créé une nouvelle facture', time: 'Il y a 12 min', icon: '🧾' },
                  { user: 'Admin Test', action: 'a modifié les paramètres', time: 'Il y a 1h', icon: '⚙️' },
                  { user: 'Gérant Test', action: 'a validé 3 commandes', time: 'Il y a 2h', icon: '✅' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg hover:bg-dark-elevated transition-colors">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-text-primary">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-text-muted mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Graphique simulé */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes des 7 derniers jours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {[65, 78, 45, 89, 92, 73, 85].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-accent-yellow/20 border border-accent-yellow/40 rounded-t hover:bg-accent-yellow/40 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-text-muted">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedPage>
  )
}
