'use client'

/**
 * TABLEAU FACTURES/DEVIS
 */

import type { Invoice } from '@/lib/types/models'

interface InvoiceTableProps {
  invoices: Invoice[]
  onView?: (invoice: Invoice) => void
  onDelete?: (id: string) => void
  onValidate?: (id: string) => void
  onMarkPaid?: (id: string) => void
}

export default function InvoiceTable({ invoices, onView, onDelete, onValidate, onMarkPaid }: InvoiceTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const StatusBadge = ({ status }: { status: Invoice['status'] }) => {
    const colors: Record<string, string> = {
      'brouillon': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'en_attente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'validée': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'payée': 'bg-green-500/20 text-green-400 border-green-500/30',
      'annulée': 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    const labels: Record<string, string> = {
      'brouillon': 'Brouillon',
      'en_attente': 'En attente',
      'validée': 'Validée',
      'payée': 'Payée',
      'annulée': 'Annulée',
    }
    return <span className={`badge ${colors[status]}`}>{labels[status]}</span>
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12 glass-container">
        <p className="text-text-secondary">Aucun devis/facture</p>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-dark-elevated/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                  {invoice.reference}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {invoice.client_name || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {formatDate(invoice.created_at)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-accent-yellow">
                  {formatPrice(invoice.total)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(invoice)}
                        className="text-blue-400 hover:text-blue-300"
                        title="Voir"
                      >
                        👁️
                      </button>
                    )}
                    {onValidate && invoice.status === 'en_attente' && (
                      <button
                        onClick={() => onValidate(invoice.id)}
                        className="text-green-400 hover:text-green-300"
                        title="Valider"
                      >
                        ✅
                      </button>
                    )}
                    {onMarkPaid && invoice.status === 'validée' && (
                      <button
                        onClick={() => onMarkPaid(invoice.id)}
                        className="text-accent-yellow hover:text-accent-yellow-light"
                        title="Marquer payée"
                      >
                        💰
                      </button>
                    )}
                    {onDelete && invoice.status === 'brouillon' && (
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
