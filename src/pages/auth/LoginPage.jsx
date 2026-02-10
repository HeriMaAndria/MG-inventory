import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Erreur de connexion')
      }
    } catch (err) {
      setError('Erreur serveur. Veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          padding: 1rem;
        }

        .auth-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
        }

        .auth-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .auth-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .submit-btn:hover {
          background-color: var(--accent-light);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          padding: 0.75rem;
          color: var(--error);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .auth-links {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }

        .auth-link {
          color: var(--accent);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .auth-link:hover {
          color: var(--accent-light);
        }

        .auth-divider {
          text-align: center;
          margin: 1.5rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          color: var(--text-secondary);
          text-decoration: none;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          transition: var(--transition-fast);
        }

        .back-link:hover {
          color: var(--accent);
        }

        @media (max-width: 500px) {
          .auth-card {
            padding: 1.5rem;
          }

          .auth-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="auth-card">
        <Link to="/welcome" className="back-link">
          ← Retour
        </Link>

        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Accédez à votre compte</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/signup" className="auth-link">
            Pas encore inscrit?
          </Link>
          <a href="#forgot" className="auth-link">
            Mot de passe oublié?
          </a>
        </div>
      </div>
    </div>
  )
}
