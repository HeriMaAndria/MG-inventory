'use client'

/**
 * PAGE GESTION FACTURES (GÉRANT)
 * Validation et suivi paiements
 */

import { useState, useEffect } from 'react'
import { invoiceService } from '@/lib/services'
import type { Invoice } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'
import InvoiceTable from '@/components/tables/InvoiceTable'

export default function GerantFacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const loadInvoices = async () => {
    setLoading(true)
    const { data } = await invoiceService.getAll()
    setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleValidate = async (id: string) => {
    await invoiceService.validate(id)
    loadInvoices()
  }

  const handleMarkPaid = async (id: string) => {
    await invoiceService.markAsPaid(id)
    loadInvoices()
  }

  const stats = {
    total: invoices.length,
    en_attente: invoices.filter(i => i.status === 'en_attente').length,
    validee: invoices.filter(i => i.status === 'validée').length,
    payee: invoices.filter(i => i.status === 'payée').length,
    total_amount: invoices.reduce((sum, i) => sum + i.total, 0),
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">🧾 Gestion des Factures</h1>
            <p className="text-sm text-text-secondary mt-1">Validation et suivi paiements</p>
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
                <div className="text-4xl">📋</div>
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
                  <p className="text-sm text-text-secondary">Montant total</p>
                  <p className="text-xl font-bold text-accent-yellow">
                    {formatPrice(stats.total_amount)}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </Card>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onValidate={handleValidate}
              onMarkPaid={handleMarkPaid}
            />
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
