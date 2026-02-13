# MG Inventory v2

Application moderne de gestion de factures et de stock avec support multi-utilisateurs et synchronisation offline.

## 🚀 Fonctionnalités

### Pour les Utilisateurs
- ✅ Création de factures et devis
- 📊 Dashboard personnel avec KPIs
- 💰 Calcul automatique des marges
- 📱 Mode offline avec synchronisation
- 🔍 Recherche produits (fuzzy search)
- 📦 Consultation du stock disponible

### Pour les Gérants
- 👥 Gestion des utilisateurs
- ✓ Validation des factures
- 📈 Dashboard global avec statistiques
- 📦 Gestion complète du stock
- 🔔 Notifications et alertes
- 📋 Historique d'activité

## 🛠️ Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + BEM
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Offline Storage**: IndexedDB (idb)
- **PDF Generation**: jsPDF + html2canvas
- **Search**: Fuse.js
- **Build Tool**: Turbo (Monorepo)

## 📦 Structure du Projet

```
mg-inventory-v2/
├── apps/
│   └── web/                 # Application Next.js principale
│       ├── src/
│       │   ├── app/         # App Router (pages)
│       │   ├── components/  # Composants réutilisables
│       │   ├── features/    # Features (auth, dashboard, etc.)
│       │   ├── lib/         # Utilities, store, Supabase
│       │   ├── types/       # TypeScript types
│       │   └── styles/      # Global styles
│       └── package.json
├── packages/
│   ├── typescript-config/   # Configs TypeScript partagées
│   ├── ui/                  # Composants UI partagés (future)
│   └── database/            # Types et utilities DB (future)
└── package.json             # Root package
```

## 🚦 Installation

### Prérequis
- Node.js 18.17+
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone <repository-url>
cd mg-inventory-v2
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cd apps/web
cp .env.example .env.local
```

Éditer `.env.local` avec vos clés Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Lancer en mode développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 👤 Comptes de Test

Le mode mock est activé par défaut. Utilisez ces identifiants:

- **Admin**: admin@mg-inventory.com / password
- **Gérant**: manager@mg-inventory.com / password
- **Utilisateur**: user@mg-inventory.com / password

## 📊 Base de Données (Supabase)

### Tables Principales

1. **users** - Utilisateurs
2. **products** - Produits
3. **product_variants** - Variantes de produits
4. **clients** - Clients
5. **invoices** - Factures/Devis
6. **invoice_items** - Lignes de facture
7. **notifications** - Notifications
8. **activity_logs** - Logs d'activité

### Migration vers Supabase

1. Créer un projet Supabase
2. Exécuter les migrations SQL (à créer)
3. Configurer Row Level Security (RLS)
4. Activer Realtime pour les notifications

## 🔐 Sécurité (RLS)

Les politiques RLS Supabase garantissent:
- Les utilisateurs ne voient que leurs données
- Les gérants ont accès complet
- Les validations côté serveur

## 📱 Mode Offline

L'application utilise IndexedDB pour:
- Mettre en cache les produits
- Stocker les factures brouillons
- Queue des actions en attente de sync

La synchronisation se fait automatiquement au retour en ligne.

## 🎨 Conventions de Code

- **BEM** pour les noms de classes CSS
- **Feature-based** pour l'organisation des dossiers
- **TypeScript strict** mode activé
- **ESLint** + **Prettier** pour le formatage

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run start

# Linting
npm run lint

# Formatage
npm run format

# Clean
npm run clean
```

## 🚀 Déploiement sur Vercel

1. Pusher le code sur GitHub
2. Importer le projet dans Vercel
3. Configurer les variables d'environnement
4. Déployer automatiquement

### Variables d'environnement Vercel

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=your-vercel-url
```

## 🔄 Roadmap

- [ ] Migration complète vers Supabase
- [ ] Tests E2E (Playwright)
- [ ] PWA support
- [ ] Export Excel
- [ ] Rapports avancés
- [ ] Multi-devises
- [ ] API REST documentée

## 📄 Licence

Propriétaire - Tous droits réservés

## 👥 Contributeurs

Votre équipe ici

---

**Version**: 1.0.0  
**Dernière mise à jour**: Février 2025
