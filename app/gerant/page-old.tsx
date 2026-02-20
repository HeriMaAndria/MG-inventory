'use client'

import { useRouter } from 'next/navigation'
import { logout, getCurrentUser } from '@/lib/auth/mockAuth'
import ProtectedPage from '@/components/ProtectedPage'
import StatCard from '@/components/dashboard/StatCard'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export default function GerantDashboard() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedPage allowedRoles={['gerant']}>
      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent-yellow/10 rounded-xl border border-accent-yellow/20">
                <span className="text-3xl">🧑‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Dashboard Gérant
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
              title="Stock total"
              value="1,234"
              icon="📦"
              subtitle="produits"
            />
            
            <StatCard
              title="Valeur du stock"
              value="15.2M Ar"
              icon="💰"
              trend={{ value: "+8% ce mois", positive: true }}
            />
            
            <StatCard
              title="Commandes en attente"
              value="23"
              icon="⏳"
              trend={{ value: "-12% vs hier", positive: true }}
            />
            
            <StatCard
              title="Stock faible"
              value="8"
              icon="⚠️"
              subtitle="produits < 10"
            />
          </div>

          {/* Accès rapide */}
          <Card>
            <CardHeader>
              <CardTitle>Gestion rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/gerant/stock">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">📦</div>
                      <p className="font-semibold text-text-primary">Stock</p>
                      <p className="text-sm text-text-secondary">Gérer les produits</p>
                    </div>
                  </div>
                </Link>

                <Link href="/gerant/commandes">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🛒</div>
                      <p className="font-semibold text-text-primary">Commandes</p>
                      <p className="text-sm text-text-secondary">Suivre les achats</p>
                    </div>
                  </div>
                </Link>

                <Link href="/gerant/revendeurs">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🧑‍💻</div>
                      <p className="font-semibold text-text-primary">Revendeurs</p>
                      <p className="text-sm text-text-secondary">Gérer partenaires</p>
                    </div>
                  </div>
                </Link>

                <Link href="/gerant/factures">
                  <div className="elevated-container p-6 hover:glow-yellow cursor-pointer transition-all group">
                    <div className="text-center space-y-2">
                      <div className="text-4xl group-hover:scale-110 transition-transform">🧾</div>
                      <p className="font-semibold text-text-primary">Factures</p>
                      <p className="text-sm text-text-secondary">Valider paiements</p>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Alertes stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚠️</span>
                <span>Alertes stock faible</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Tôle ondulée 2m', qty: 5, unit: 'm²', category: 'tôles' },
                  { name: 'Vis autoperceuse 5mm', qty: 8, unit: 'boîte', category: 'accessoires' },
                  { name: 'Panne C 80x40', qty: 3, unit: 'pièce', category: 'panne C' },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-dark-elevated border border-red-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-semibold text-text-primary">{product.name}</p>
                        <p className="text-sm text-text-muted">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">{product.qty} {product.unit}</p>
                      <p className="text-xs text-text-muted">Réapprovisionner</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { ref: 'CMD-001', client: 'Revendeur A', montant: '125,000 Ar', statut: 'En attente', color: 'yellow' },
                  { ref: 'CMD-002', client: 'Revendeur B', montant: '89,500 Ar', statut: 'Validée', color: 'green' },
                  { ref: 'CMD-003', client: 'Revendeur C', montant: '245,000 Ar', statut: 'Livrée', color: 'blue' },
                ].map((cmd, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-dark-elevated transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">📋</div>
                      <div>
                        <p className="font-semibold text-text-primary">{cmd.ref}</p>
                        <p className="text-sm text-text-secondary">{cmd.client}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <p className="font-semibold text-text-primary">{cmd.montant}</p>
                      <span className={`badge badge-${cmd.color}`}>{cmd.statut}</span>
                    </div>
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
