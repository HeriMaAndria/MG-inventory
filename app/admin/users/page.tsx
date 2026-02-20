'use client'

/**
 * PAGE GESTION UTILISATEURS (ADMIN)
 */

import { useState, useEffect } from 'react'
import { mockUserService, type UserAccount } from '@/lib/services/implementations/mockUserService'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ProtectedPage from '@/components/ProtectedPage'
import UserForm from '@/components/forms/UserForm'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    const { data } = await mockUserService.getAll()
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAdd = () => {
    setEditingUser(null)
    setModalOpen(true)
  }

  const handleEdit = (user: UserAccount) => {
    setEditingUser(user)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await mockUserService.delete(id)
    loadUsers()
  }

  const handleToggleActive = async (id: string) => {
    await mockUserService.toggleActive(id)
    loadUsers()
  }

  const handleSuccess = () => {
    setModalOpen(false)
    setEditingUser(null)
    loadUsers()
  }

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    gerant: users.filter(u => u.role === 'gerant').length,
    revendeur: users.filter(u => u.role === 'revendeur').length,
    active: users.filter(u => u.active).length,
  }

  const RoleBadge = ({ role }: { role: string }) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-500/20 text-red-400 border-red-500/30',
      'gerant': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'revendeur': 'bg-green-500/20 text-green-400 border-green-500/30',
    }
    return <span className={`badge ${colors[role]}`}>{role}</span>
  }

  return (
    <ProtectedPage allowedRoles={['admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">👥 Gestion Utilisateurs</h1>
              <p className="text-sm text-text-secondary mt-1">{stats.total} utilisateur(s)</p>
            </div>
            <Button onClick={handleAdd}>➕ Nouvel utilisateur</Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Admins</p>
                  <p className="text-3xl font-bold text-red-400">{stats.admin}</p>
                </div>
                <div className="text-4xl">👑</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Gérants</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.gerant}</p>
                </div>
                <div className="text-4xl">🧑‍💼</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Revendeurs</p>
                  <p className="text-3xl font-bold text-green-400">{stats.revendeur}</p>
                </div>
                <div className="text-4xl">🧑‍💻</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Actifs</p>
                  <p className="text-3xl font-bold text-text-primary">{stats.active}</p>
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
            <div className="glass-container overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-elevated border-b border-dark-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Nom</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Rôle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-dark-elevated/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-text-primary">
                          {user.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`badge ${user.active ? 'badge-green' : 'badge-red'}`}>
                            {user.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-accent-yellow hover:text-accent-yellow-light"
                              title="Modifier"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleToggleActive(user.id)}
                              className="text-blue-400 hover:text-blue-300"
                              title={user.active ? 'Désactiver' : 'Activer'}
                            >
                              {user.active ? '🔒' : '🔓'}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-400 hover:text-red-300"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingUser ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
        >
          <UserForm
            user={editingUser || undefined}
            onSuccess={handleSuccess}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      </div>
    </ProtectedPage>
  )
}
