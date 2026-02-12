import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/welcome')
  }

  return (
    <nav className="navbar">
      <style>{`
        .navbar {
          background-color: var(--bg-secondary);
          border-bottom: 2px solid var(--border-light);
          padding: 1rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow-sm);
        }

        .navbar-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .navbar-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent);
          cursor: pointer;
          text-decoration: none;
        }

        .navbar-logo:hover {
          color: var(--accent-light);
        }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-username {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .navbar-logout {
          padding: 0.5rem 1rem;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .navbar-logout:hover {
          background-color: var(--accent);
          color: #000;
          border-color: var(--accent);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--accent);
          font-size: 1.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .navbar-content {
            gap: 1rem;
          }

          .navbar-logo {
            font-size: 1.25rem;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .navbar-user {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="navbar-content">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          MG-Inventory
        </div>

        {user && (
          <div className="navbar-user">
            <span className="navbar-username">{user.email}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
