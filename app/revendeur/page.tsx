'use client'

import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth/mockAuth'
import ProtectedPage from '@/components/ProtectedPage'
import StatCard from '@/components/dashboard/StatCard'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function RevendeurDashboard() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-yellow/10 rounded-xl border border-accent-yellow/20">
                <span className="text-3xl">🧑‍💻</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Dashboard Revendeur
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
              title="Mes clients"
              value="28"
              icon="👥"
              trend={{ value: "+3 ce mois", positive: true }}
            />
            
            <StatCard
              title="CA du mois"
              value="1.2M Ar"
              icon="💰"
              trend={{ value: "+18% vs mois dernier", positive: true }}
            />
            
            <StatCard
              title="Devis en cours"
              value="12"
              icon="📝"
              subtitle="à finaliser"
            />
            
            <StatCard
              title="Commandes"
              value="45"
              icon="🛒"
              subtitle="ce mois"
            />
          </div>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/revendeur/devis">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">📝</div>
                      <p className="font-semibold text-text-primary">Nouveau devis</p>
                      <p className="text-sm text-text-secondary">Créer un devis</p>
                    </div>
                  </div>
                </Link>

                <Link href="/revendeur/clients">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">👥</div>
                      <p className="font-semibold text-text-primary">Mes clients</p>
                      <p className="text-sm text-text-secondary">Gérer contacts</p>
                    </div>
                  </div>
                </Link>

                <Link href="/revendeur/catalogue">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">📦</div>
                      <p className="font-semibold text-text-primary">Catalogue</p>
                      <p className="text-sm text-text-secondary">Produits dispo</p>
                    </div>
                  </div>
                </Link>

                <Link href="/revendeur/commandes">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🧾</div>
                      <p className="font-semibold text-text-primary">Commandes</p>
                      <p className="text-sm text-text-secondary">Historique</p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Devis récents */}
          <Card>
            <CardHeader>
              <CardTitle>Devis en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { ref: 'DEV-045', client: 'Client A', montant: '450,000 Ar', date: '10/02/2026', marge: '15%' },
                  { ref: 'DEV-046', client: 'Client B', montant: '125,000 Ar', date: '11/02/2026', marge: '12%' },
                  { ref: 'DEV-047', client: 'Client C', montant: '780,000 Ar', date: '12/02/2026', marge: '18%' },
                ].map((devis, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-dark-elevated transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform">📄</div>
                      <div>
                        <p className="font-semibold text-text-primary">{devis.ref}</p>
                        <p className="text-sm text-text-secondary">{devis.client} • {devis.date}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-text-primary">{devis.montant}</p>
                        <p className="text-xs text-accent-yellow">Marge: {devis.marge}</p>
                      </div>
                      <button className="btn-primary px-4 py-2 text-sm">
                        Convertir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mes meilleurs clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top clients du mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Client A', montant: '520,000 Ar', commandes: 8 },
                    { name: 'Client B', montant: '385,000 Ar', commandes: 5 },
                    { name: 'Client C', montant: '290,000 Ar', commandes: 4 },
                  ].map((client, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-elevated transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          i === 0 ? 'bg-accent-yellow text-dark-bg' : 
                          i === 1 ? 'bg-gray-400 text-dark-bg' :
                          'bg-orange-600 text-white'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{client.name}</p>
                          <p className="text-xs text-text-muted">{client.commandes} commandes</p>
                        </div>
                      </div>
                      <p className="font-semibold text-accent-yellow">{client.montant}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Produits populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Tôle ondulée 2m', ventes: 45, icon: '📦' },
                    { name: 'Panne C 80x40', ventes: 32, icon: '📦' },
                    { name: 'Vis autoperceuse', ventes: 28, icon: '🔩' },
                  ].map((produit, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-elevated transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{produit.icon}</div>
                        <p className="text-text-primary">{produit.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text-primary">{produit.ventes}</p>
                        <p className="text-xs text-text-muted">ventes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedPage>
  )
}
