import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger les utilisateurs depuis Supabase
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setUsers(data || [])
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', id)

      if (err) throw err
      loadUsers()
    } catch (err) {
      setError('Erreur lors de la mise à jour du rôle')
      console.error(err)
    }
  }

  return (
    <div className="users-management">
      <style>{`
        .users-management {
          padding: 2rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          padding: 1rem;
          color: var(--error);
          margin-bottom: 1rem;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .users-table thead {
          background-color: var(--bg-tertiary);
          border-bottom: 2px solid var(--border-light);
        }

        .users-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent);
          font-size: 0.9rem;
        }

        .users-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .users-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }

        .role-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          color: white;
        }

        .role-admin {
          background-color: #ef4444;
        }

        .role-revendeur {
          background-color: #3b82f6;
        }

        .role-select {
          padding: 0.5rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
        }

        .role-select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .users-management {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .users-table {
            font-size: 0.85rem;
          }

          .users-table th,
          .users-table td {
            padding: 0.75rem;
          }
        }
      `}</style>

      <h1 className="page-title">Gestion des Utilisateurs</h1>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Chargement...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">Aucun utilisateur</div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Entreprise</th>
              <th>Rôle</th>
              <th>Créé le</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.email}</strong></td>
                <td>{user.companyName || '-'}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Revendeur'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <select
                    className="role-select"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="revendeur">Revendeur</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
