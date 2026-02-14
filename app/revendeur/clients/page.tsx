'use client'

/**
 * PAGE MES CLIENTS (REVENDEUR)
 */

import { useState, useEffect } from 'react'
import { clientService } from '@/lib/services'
import { getCurrentUser } from '@/lib/auth/mockAuth'
import type { Client } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ProtectedPage from '@/components/ProtectedPage'
import ClientForm from '@/components/forms/ClientForm'

export default function ClientsPage() {
  const user = getCurrentUser()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const loadClients = async () => {
    setLoading(true)
    const { data } = await clientService.getAll(user?.id || 'revendeur-1')
    setClients(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleAdd = () => {
    setEditingClient(null)
    setModalOpen(true)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce client ?')) return
    await clientService.delete(id)
    loadClients()
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setEditingClient(null)
    loadClients()
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">👥 Mes Clients</h1>
              <p className="text-sm text-text-secondary mt-1">{clients.length} client(s)</p>
            </div>
            <Button onClick={handleAdd}>➕ Nouveau client</Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} hover className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-text-primary">{client.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-accent-yellow hover:text-accent-yellow-light"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>📧</span>
                        <span className="text-text-secondary">{client.email}</span>
                      </div>
                    )}

                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>📞</span>
                        <span className="text-text-secondary">{client.phone}</span>
                      </div>
                    )}

                    {client.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <span>📍</span>
                        <span className="text-text-secondary line-clamp-2">{client.address}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && clients.length === 0 && (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Aucun client</p>
              <Button onClick={handleAdd} className="mt-4">Ajouter votre premier client</Button>
            </div>
          )}
        </main>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Modifier client' : 'Nouveau client'}>
          <ClientForm
            client={editingClient || undefined}
            revendeurId={user?.id || 'revendeur-1'}
            onSuccess={handleSuccess}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      </div>
    </ProtectedPage>
  )
}
