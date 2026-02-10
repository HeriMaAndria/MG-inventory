# MG-Inventory - Supabase Edition

Application de gestion des factures migrée vers **Supabase** pour une meilleure scalabilité et sécurité.

## 🚀 Fonctionnalités

### Revendeur
- ✅ Créer des factures en brouillon
- ✅ Soumettre pour validation
- ✅ Voir l'historique
- ✅ Gérer le stock
- ✅ Gérer les clients
- ✅ Télécharger des factures en PDF

### Admin
- ✅ Valider les factures
- ✅ Refuser les factures
- ✅ Gérer les statuts
- ✅ Voir tous les utilisateurs
- ✅ Générer les numéros officiels
- ✅ Accès à tous les données

## 📦 Installation

```bash
# 1. Cloner le projet
git clone <votre-repo>
cd mg-inventory-supabase

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# 4. Lancer le serveur de développement
npm run dev
```

## ⚙️ Configuration Supabase

Voir le document `SETUP_SUPABASE.md` pour les étapes complètes de configuration.

## 📁 Structure du Projet

```
src/
├── components/        # Composants réutilisables
├── pages/            # Pages de l'application
│   ├── user/        # Pages utilisateur
│   ├── admin/       # Pages admin
│   ├── LoginPage.jsx
│   └── SignupPage.jsx
├── services/        # Services Supabase
├── hooks/          # Hooks React personnalisés
├── styles/         # Fichiers CSS
└── utils/          # Fonctions utilitaires
```

## 🔐 Authentification

- Email + Mot de passe via Supabase Auth
- Rôles: `revendeur` (par défaut) et `admin`
- Row Level Security (RLS) pour la sécurité

## 📝 Développement

### Créer une nouvelle page
1. Ajouter le fichier dans `src/pages/`
2. Importer dans `App.jsx`
3. Protéger avec `<ProtectedRoute>` si nécessaire

### Utiliser un service
```javascript
import { InvoiceService } from '../services/invoiceService'

const invoice = await InvoiceService.createDraft({
  type: 'commande',
  client_data: { name: 'Client' },
  items: [],
  total: 0
})
```

### Utiliser un hook
```javascript
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, profile, isAdmin } = useAuth()
  // ...
}
```

## 🚀 Déploiement

```bash
# Build production
npm run build

# Prévisualiser la build
npm run preview
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)

## 🤝 Support

Pour toute question ou problème, consultez le fichier `SETUP_SUPABASE.md`.
