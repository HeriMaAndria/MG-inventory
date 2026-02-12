import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { profile } = useAuth()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const userLinks = [
    { path: '/', label: 'Tableau de bord', icon: '⊞' },
    { path: '/invoices/create', label: 'Créer facture', icon: '+' },
    { path: '/invoices', label: 'Mes factures', icon: '📋' },
    { path: '/stock', label: 'Stock', icon: '📦' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/settings', label: 'Paramètres', icon: '⚙' },
  ]

  const adminLinks = [
    { path: '/admin', label: 'Tableau de bord', icon: '⊞' },
    { path: '/admin/pending', label: 'En attente', icon: '⏳' },
    { path: '/admin/invoices', label: 'Factures', icon: '📋' },
    { path: '/admin/stock', label: 'Stock', icon: '📦' },
    { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
    { path: '/admin/reports', label: 'Rapports', icon: '📊' },
  ]

  const links = profile?.role === 'admin' ? adminLinks : userLinks

  return (
    <div className="sidebar-wrapper">
      <style>{`
        .sidebar-wrapper {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 260px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-light);
          overflow-y: auto;
          transition: width 0.3s ease;
          position: fixed;
          height: calc(100vh - 60px);
          top: 60px;
          left: 0;
          z-index: 99;
        }

        .sidebar.collapsed {
          width: 70px;
        }

        .sidebar-toggle {
          padding: 1rem;
          background: none;
          border: none;
          color: var(--accent);
          font-size: 1.25rem;
          cursor: pointer;
          text-align: center;
          border-bottom: 1px solid var(--border-color);
        }

        .sidebar-menu {
          list-style: none;
          padding: 1rem 0;
        }

        .sidebar-item {
          margin: 0.25rem 0;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-fast);
          border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
          background-color: var(--bg-tertiary);
          color: var(--accent);
        }

        .sidebar-link.active {
          background-color: var(--bg-tertiary);
          color: var(--accent);
          border-left-color: var(--accent);
        }

        .sidebar-icon {
          min-width: 24px;
          text-align: center;
        }

        .sidebar.collapsed .sidebar-label {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 260px;
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-lg);
          }

          .sidebar.collapsed {
            width: 260px;
          }
        }
      `}</style>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? '›' : '‹'}
        </button>

        <ul className="sidebar-menu">
          {links.map((link) => (
            <li key={link.path} className="sidebar-item">
              <Link 
                to={link.path}
                className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
