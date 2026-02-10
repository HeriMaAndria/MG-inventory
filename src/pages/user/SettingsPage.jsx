import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function SettingsPage() {
  const { user, profile } = useAuth()
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    address: '',
    nif: '',
    stat: '',
    responsibleNumber: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        nif: profile.nif || '',
        stat: profile.stat || '',
        responsibleNumber: profile.responsibleNumber || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      setMessage('Paramètres sauvegardés!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="settings-page">
      <style>{`
        .settings-page {
          padding: 2rem;
          max-width: 800px;
        }

        .settings-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .settings-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-light);
        }

        .info-item {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .info-value {
          color: var(--text-primary);
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

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .save-btn {
          padding: 0.75rem 2rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .save-btn:hover {
          background-color: var(--accent-light);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          color: var(--success);
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success);
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-card {
            padding: 1rem;
          }

          .info-item {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .save-btn {
            width: 100%;
          }
        }
      `}</style>

      <h1 className="settings-title">Paramètres</h1>

      {message && <div className="message">{message}</div>}

      {/* Profil */}
      <div className="settings-card">
        <div className="settings-section">
          <h2 className="section-title">Profil</h2>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rôle</span>
            <span className="info-value">{profile?.role === 'admin' ? 'Administrateur' : 'Revendeur'}</span>
          </div>
        </div>
      </div>

      {/* Entreprise */}
      <div className="settings-card">
        <div className="settings-section">
          <h2 className="section-title">Informations Entreprise</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom de l'entreprise</label>
              <input
                type="text"
                className="form-input"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ma Boutique"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="034 XX XX XX"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Votre adresse"
              />
            </div>

            <div className="form-group">
              <label className="form-label">NIF</label>
              <input
                type="text"
                className="form-input"
                value={formData.nif}
                onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                placeholder="Numéro d'identification fiscale"
              />
            </div>

            <div className="form-group">
              <label className="form-label">STAT</label>
              <input
                type="text"
                className="form-input"
                value={formData.stat}
                onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                placeholder="Numéro STAT"
              />
            </div>

            {profile?.role === 'revendeur' && (
              <div className="form-group">
                <label className="form-label">Numéro Responsable</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.responsibleNumber}
                  onChange={(e) => setFormData({ ...formData, responsibleNumber: e.target.value })}
                  placeholder="REF123"
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
