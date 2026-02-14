'use client'

/**
 * TABLEAU COMMANDES
 */

import type { Order } from '@/lib/types/models'

interface OrderTableProps {
  orders: Order[]
  onView?: (order: Order) => void
  showActions?: boolean
}

export default function OrderTable({ orders, onView, showActions = true }: OrderTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const colors: Record<string, string> = {
      'en_attente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'validée': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'refusée': 'bg-red-500/20 text-red-400 border-red-500/30',
      'commandée': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'livrée': 'bg-green-500/20 text-green-400 border-green-500/30',
      'payée': 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
      'retournée': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    }
    const labels: Record<string, string> = {
      'en_attente': 'En attente',
      'validée': 'Validée',
      'refusée': 'Refusée',
      'commandée': 'Commandée',
      'livrée': 'Livrée',
      'payée': 'Payée',
      'retournée': 'Retournée',
    }
    return <span className={`badge ${colors[status]}`}>{labels[status]}</span>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 glass-container">
        <p className="text-text-secondary">Aucune commande</p>
      </div>
    )
  }

  return (
    <div className="glass-container overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-elevated border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Référence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Articles</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Statut</th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-dark-elevated/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">{order.reference}</div>
                  {order.notes && (
                    <div className="text-xs text-text-muted mt-1">{order.notes}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {order.items.length} article(s)
                </td>
                <td className="px-4 py-3 text-sm font-medium text-accent-yellow">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={order.status} />
                </td>
                {showActions && onView && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onView(order)}
                      className="text-blue-400 hover:text-blue-300"
                      title="Voir détails"
                    >
                      👁️
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
