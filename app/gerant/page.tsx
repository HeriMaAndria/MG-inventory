'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'
import RevenueChart from '@/components/charts/RevenueChart'
import TopProductsChart from '@/components/charts/TopProductsChart'

export default function GerantDashboard() {
  const stats = {
    stock: 234,
    lowStock: 8,
    orders: 45,
    pending: 12,
  }

  const quickActions = [
    { icon: '📦', label: 'Gérer le stock', href: '/gerant/stock', color: 'bg-blue-500' },
    { icon: '🛒', label: 'Commandes', href: '/gerant/commandes', color: 'bg-green-500' },
    { icon: '🧾', label: 'Factures', href: '/gerant/factures', color: 'bg-yellow-500' },
    { icon: '👥', label: 'Revendeurs', href: '/gerant/revendeurs', color: 'bg-purple-500' },
  ]

  // Données mock pour les graphiques
  const revenueData = [
    { month: 'Jan', revenue: 2400000 },
    { month: 'Fév', revenue: 2800000 },
    { month: 'Mar', revenue: 3200000 },
    { month: 'Avr', revenue: 2900000 },
    { month: 'Mai', revenue: 3500000 },
    { month: 'Juin', revenue: 4200000 },
  ]

  const topProductsData = [
    { name: 'Tôle ondulée', sales: 245 },
    { name: 'Vis', sales: 189 },
    { name: 'Panne C', sales: 156 },
    { name: 'Bardage', sales: 134 },
    { name: 'Accessoires', sales: 98 },
  ]

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard Gérant</h1>
          <p className="text-text-secondary mt-1">Gestion commerciale</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Produits</p>
                <p className="text-3xl font-bold text-text-primary">{stats.stock}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Stock faible</p>
                <p className="text-3xl font-bold text-orange-400">{stats.lowStock}</p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Commandes</p>
                <p className="text-3xl font-bold text-text-primary">{stats.orders}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">En attente</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} className="block">
                <Card className="p-6 hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${action.color} bg-opacity-20 rounded-lg flex items-center justify-center text-2xl`}>
                      {action.icon}
                    </div>
                    <span className="font-semibold text-text-primary">{action.label}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution CA */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">📈 Évolution du CA</h2>
            <RevenueChart data={revenueData} />
          </Card>

          {/* Top Produits */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">🏆 Top Produits</h2>
            <TopProductsChart data={topProductsData} />
          </Card>
        </div>

        {/* Alerts */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Alertes</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-text-primary font-medium">Stock faible détecté</p>
                <p className="text-text-secondary text-sm">8 produits nécessitent un réapprovisionnement</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-text-primary font-medium">12 commandes en attente</p>
                <p className="text-text-secondary text-sm">À valider dans la section commandes</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedPage>
  )
}
