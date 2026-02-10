import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="welcome-container">
      <style>{`
        .welcome-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          display: flex;
          flex-direction: column;
        }

        .welcome-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .welcome-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .welcome-logo {
          font-size: 3rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 1rem;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
        }

        .welcome-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 3rem 0;
          width: 100%;
        }

        .feature-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: var(--transition);
        }

        .feature-card:hover {
          border-color: var(--accent);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.1);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .feature-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .welcome-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin: 2rem 0;
          flex-wrap: wrap;
          width: 100%;
        }

        .welcome-btn {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 1rem;
        }

        .welcome-btn-primary {
          background-color: var(--accent);
          color: #000;
        }

        .welcome-btn-primary:hover {
          background-color: var(--accent-light);
        }

        .welcome-btn-secondary {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }

        .welcome-btn-secondary:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .welcome-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-light);
          padding: 2rem;
          text-align: center;
          margin-top: 3rem;
        }

        .welcome-footer-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .welcome-footer-text {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .welcome-contact {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .contact-link {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition-fast);
        }

        .contact-link:hover {
          color: var(--accent-light);
        }

        @media (max-width: 768px) {
          .welcome-logo {
            font-size: 2rem;
          }

          .welcome-title {
            font-size: 1.75rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .welcome-features {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .welcome-buttons {
            flex-direction: column;
          }

          .welcome-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="welcome-content">
        <div className="welcome-header">
          <div className="welcome-logo">MG-Inventory</div>
          <h1 className="welcome-title">Gestion d'Inventaire Complète</h1>
          <p className="welcome-subtitle">Solution de facturation et gestion de stock pour votre entreprise</p>
        </div>

        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-title">Factures Complètes</h3>
            <p className="feature-text">Créez, gérez et validez vos factures facilement</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3 className="feature-title">Gestion Stock</h3>
            <p className="feature-text">Suivez votre inventaire en temps réel</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Clients</h3>
            <p className="feature-text">Gérez vos clients et l'historique d'achat</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Rapports</h3>
            <p className="feature-text">Analysez vos ventes et marges</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3 className="feature-title">Multi-revendeurs</h3>
            <p className="feature-text">Gérez plusieurs revendeurs facilement</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Sécurisé</h3>
            <p className="feature-text">Données protégées et authentification sécurisée</p>
          </div>
        </div>

        <div className="welcome-buttons">
          <button 
            className="welcome-btn welcome-btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
          <button 
            className="welcome-btn welcome-btn-secondary"
            onClick={() => navigate('/signup')}
          >
            Créer un compte
          </button>
        </div>
      </div>

      <div className="welcome-footer">
        <h3 className="welcome-footer-title">À propos</h3>
        <p className="welcome-footer-text">
          Cette plateforme est développée pour une entreprise spéciale. Si vous êtes intéressé par une utilisation personnelle, veuillez contacter le développeur.
        </p>
        <div className="welcome-contact">
          <a href="https://www.linkedin.com/in/herimampionona-andrianarimbola-a6110b398" target="_blank" rel="noopener noreferrer" className="contact-link">
            LinkedIn
          </a>
          <a href="mailto:heryandrianarimbola@gmail.com" className="contact-link">
            heryandrianarimbola@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}
