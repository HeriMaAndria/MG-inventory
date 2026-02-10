import { useState, useEffect } from 'react'

export default function UsersManagement() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    setUsers([
      { id: 1, email: 'user1@example.com', company: 'Boutique A', role: 'revendeur', created: '2025-01-15' },
      { id: 2, email: 'user2@example.com', company: 'Boutique B', role: 'revendeur', created: '2025-01-20' },
      { id: 3, email: 'user3@example.com', company: 'Boutique C', role: 'revendeur', created: '2025-02-01' },
      { id: 4, email: 'admin@example.com', company: 'Admin', role: 'admin', created: '2024-12-01' },
    ])
  }, [])

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, role: newRole } : user
    ))
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
              <td>{user.company}</td>
              <td>
                <span className={`role-badge role-${user.role}`}>
                  {user.role === 'admin' ? 'Administrateur' : 'Revendeur'}
                </span>
              </td>
              <td>{new Date(user.created).toLocaleDateString('fr-FR')}</td>
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
    </div>
  )
}
