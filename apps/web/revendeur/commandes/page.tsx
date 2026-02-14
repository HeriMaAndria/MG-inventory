'use client'

/**
 * PAGE MES COMMANDES (REVENDEUR)
 */

import { useState, useEffect } from 'react'
import { orderService } from '@/lib/services'
import { getCurrentUser } from '@/lib/auth/mockAuth'
import type { Order, OrderStatus } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'
import OrderTable from '@/components/tables/OrderTable'

export default function CommandesPage() {
  const user = getCurrentUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await orderService.getAll({
      revendeur_id: user?.id || 'revendeur-1',
      status: statusFilter || undefined,
    })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const stats = {
    total: orders.length,
    en_attente: orders.filter(o => o.status === 'en_attente').length,
    validee: orders.filter(o => o.status === 'validée').length,
    livree: orders.filter(o => o.status === 'livrée').length,
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">🛒 Mes Commandes</h1>
            <p className="text-sm text-text-secondary mt-1">{stats.total} commande(s)</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total</p>
                  <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">En attente</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.en_attente}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Validées</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.validee}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Livrées</p>
                  <p className="text-3xl font-bold text-green-400">{stats.livree}</p>
                </div>
                <div className="text-4xl">🚚</div>
              </div>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="p-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
              className="input-dark"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="validée">Validée</option>
              <option value="refusée">Refusée</option>
              <option value="commandée">Commandée</option>
              <option value="livrée">Livrée</option>
              <option value="payée">Payée</option>
            </select>
          </Card>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <OrderTable orders={orders} />
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
