'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'

export default function RevendeurDashboard() {
  const stats = {
    clients: 28,
    quotes: 12,
    orders: 45,
    revenue: 2450000,
  }

  const quickActions = [
    { icon: '📚', label: 'Catalogue', href: '/revendeur/catalogue', color: 'bg-blue-500' },
    { icon: '👥', label: 'Mes clients', href: '/revendeur/clients', color: 'bg-green-500' },
    { icon: '📝', label: 'Créer un devis', href: '/revendeur/devis', color: 'bg-yellow-500' },
    { icon: '🛒', label: 'Mes commandes', href: '/revendeur/commandes', color: 'bg-purple-500' },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard Revendeur</h1>
          <p className="text-text-secondary mt-1">Gérez vos ventes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Clients</p>
                <p className="text-3xl font-bold text-text-primary">{stats.clients}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Devis en attente</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.quotes}</p>
              </div>
              <div className="text-4xl">📝</div>
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
                <p className="text-sm text-text-secondary">CA du mois</p>
                <p className="text-xl font-bold text-accent-yellow">{formatPrice(stats.revenue)}</p>
              </div>
              <div className="text-4xl">💰</div>
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

        {/* Top Clients */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Top clients du mois</h2>
          <div className="space-y-3">
            {[
              { name: 'Client A - Construction', amount: 520000, orders: 8 },
              { name: 'Client B - Entreprise BTP', amount: 385000, orders: 5 },
              { name: 'Client C - Particulier', amount: 290000, orders: 4 },
            ].map((client, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
                <div>
                  <p className="text-text-primary font-medium">{client.name}</p>
                  <p className="text-text-muted text-sm">{client.orders} commande(s)</p>
                </div>
                <span className="text-accent-yellow font-bold">{formatPrice(client.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedPage>
  )
}
