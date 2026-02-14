'use client'

/**
 * PAGE CRÉER DEVIS (REVENDEUR)
 */

import { useState, useEffect } from 'react'
import { invoiceService } from '@/lib/services'
import { getCurrentUser } from '@/lib/auth/mockAuth'
import type { Invoice } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ProtectedPage from '@/components/ProtectedPage'
import InvoiceForm from '@/components/forms/InvoiceForm'
import InvoiceTable from '@/components/tables/InvoiceTable'

export default function DevisPage() {
  const user = getCurrentUser()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadInvoices = async () => {
    setLoading(true)
    const { data } = await invoiceService.getAll({ revendeur_id: user?.id || 'revendeur-1' })
    setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleSuccess = () => {
    setModalOpen(false)
    loadInvoices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce devis ?')) return
    await invoiceService.delete(id)
    loadInvoices()
  }

  const stats = {
    total: invoices.length,
    brouillon: invoices.filter(i => i.status === 'brouillon').length,
    en_attente: invoices.filter(i => i.status === 'en_attente').length,
    validee: invoices.filter(i => i.status === 'validée').length,
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">📝 Mes Devis</h1>
              <p className="text-sm text-text-secondary mt-1">{stats.total} devis au total</p>
            </div>
            <Button onClick={() => setModalOpen(true)}>➕ Nouveau devis</Button>
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
                  <p className="text-sm text-text-secondary">Brouillons</p>
                  <p className="text-3xl font-bold text-gray-400">{stats.brouillon}</p>
                </div>
                <div className="text-4xl">✏️</div>
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
                  <p className="text-sm text-text-secondary">Validés</p>
                  <p className="text-3xl font-bold text-green-400">{stats.validee}</p>
                </div>
                <div className="text-4xl">✅</div>
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
              onDelete={handleDelete}
            />
          )}
        </main>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Créer un devis">
          <InvoiceForm
            revendeurId={user?.id || 'revendeur-1'}
            onSuccess={handleSuccess}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      </div>
    </ProtectedPage>
  )
}
