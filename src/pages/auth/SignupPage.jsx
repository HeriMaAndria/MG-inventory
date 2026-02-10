import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'revendeur',
    companyName: '',
    responsibleNumber: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!formData.companyName) {
      setError('Le nom de l\'entreprise est obligatoire')
      return
    }

    setLoading(true)

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyName: formData.companyName,
        responsibleNumber: formData.responsibleNumber,
      })

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error || 'Erreur d\'inscription')
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
          max-width: 450px;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
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

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffd700' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
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
          text-align: center;
          margin-top: 1.5rem;
        }

        .auth-link {
          color: var(--accent);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .auth-link:hover {
          color: var(--accent-light);
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

        <h1 className="auth-title">Inscription</h1>
        <p className="auth-subtitle">Créez votre compte</p>

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
            <label className="form-label">Nom de l'entreprise</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ma Boutique"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rôle</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={loading}
            >
              <option value="revendeur">Revendeur</option>
              <option value="admin">Demande Admin</option>
            </select>
          </div>

          {formData.role === 'revendeur' && (
            <div className="form-group">
              <label className="form-label">Numéro Responsable (optionnel)</label>
              <input
                type="text"
                className="form-input"
                placeholder="REF123"
                value={formData.responsibleNumber}
                onChange={(e) => setFormData({ ...formData, responsibleNumber: e.target.value })}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="Au moins 6 caractères"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              className="form-input"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="auth-links">
          Déjà inscrit? <Link to="/login" className="auth-link">Se connecter</Link>
        </div>
      </div>
    </div>
  )
}
