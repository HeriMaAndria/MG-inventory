'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'

export default function AdminDashboard() {
  const stats = {
    users: 12,
    orders: 145,
    revenue: 8450000,
    products: 234,
  }

  const quickActions = [
    { icon: '👥', label: 'Gérer utilisateurs', href: '/admin/users', color: 'bg-blue-500' },
    { icon: '⚙️', label: 'Paramètres', href: '/admin/settings', color: 'bg-purple-500' },
    { icon: '📊', label: 'Rapports', href: '#', color: 'bg-green-500' },
    { icon: '🔔', label: 'Notifications', href: '#', color: 'bg-yellow-500' },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  return (
    <ProtectedPage allowedRoles={['admin']}>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard Admin</h1>
          <p className="text-text-secondary mt-1">Vue d'ensemble du système</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Utilisateurs</p>
                <p className="text-3xl font-bold text-text-primary">{stats.users}</p>
              </div>
              <div className="text-4xl">👥</div>
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
                <p className="text-sm text-text-secondary">CA Total</p>
                <p className="text-xl font-bold text-accent-yellow">{formatPrice(stats.revenue)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Produits</p>
                <p className="text-3xl font-bold text-text-primary">{stats.products}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="block"
              >
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

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">Activité récente</h2>
          <div className="space-y-3">
            {[
              { user: 'Jean Dupont', action: 'a créé un compte revendeur', time: 'Il y a 5 min' },
              { user: 'Marie Martin', action: 'a validé une commande', time: 'Il y a 12 min' },
              { user: 'Pierre Durand', action: 'a modifié les paramètres', time: 'Il y a 1h' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                <div>
                  <span className="text-text-primary font-medium">{item.user}</span>
                  <span className="text-text-secondary"> {item.action}</span>
                </div>
                <span className="text-text-muted text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedPage>
  )
}
