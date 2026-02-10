# 🧱 MG Inventory - Système de Gestion Commerciale

> **Version 1.0 - Corrigée et prête pour Vercel** ✅  
> Application Next.js 15 + Supabase avec authentification par rôles

---

## 📌 Vue d'ensemble

Application web de gestion commerciale pour matériaux de construction avec système d'authentification et 3 niveaux d'accès :
- 👑 **Admin** : Gestion complète du système
- 🧑‍💼 **Gérant** : Gestion des stocks et revendeurs
- 🧑‍💻 **Revendeur** : Consultation et commandes

### Technologies
- **Frontend** : Next.js 15 (App Router) + React 18 + Tailwind CSS
- **Backend** : Supabase (Auth + Database)
- **Déploiement** : Vercel
- **TypeScript** : Type safety complète

---

## 🚀 DÉMARRAGE RAPIDE

### Option 1 : Déploiement Vercel (Recommandé)

**📖 Suis le guide complet : [VERCEL_SETUP.md](./VERCEL_SETUP.md)**

Résumé en 3 étapes :
1. Push ton code sur GitHub
2. Importe dans Vercel
3. Configure les 2 variables d'environnement Supabase
4. Deploy ! ✨

**Durée estimée** : 10-15 minutes

---

### Option 2 : Développement Local

#### Prérequis
- Node.js 18+ installé
- Compte Supabase (gratuit)
- Git

#### Installation

```bash
# 1. Clone le projet
git clone https://github.com/ton-username/mg-inventory.git
cd mg-inventory

# 2. Installe les dépendances
npm install

# 3. Configure Supabase
cp .env.example .env.local
# Édite .env.local avec tes vraies valeurs Supabase

# 4. Lance le serveur de dev
npm run dev

# Ouvre http://localhost:3000
```

#### Obtenir les credentials Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Crée un projet (gratuit)
3. Dans **Settings > API** :
   - Copie **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copie **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Colle dans `.env.local`

**📖 Guide complet Supabase : [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

---

## 📁 STRUCTURE DU PROJET

```
mg-inventory/
├── app/                          # Next.js 15 App Router
│   ├── login/page.tsx           # Page de connexion
│   ├── admin/page.tsx           # Dashboard Admin
│   ├── gerant/page.tsx          # Dashboard Gérant
│   ├── revendeur/page.tsx       # Dashboard Revendeur
│   ├── layout.tsx               # Layout racine
│   └── globals.css              # Styles globaux
│
├── lib/                          # Utilitaires et configuration
│   └── supabase/
│       ├── client.ts            # Client Supabase (browser)
│       └── server.ts            # Client Supabase (server)
│
├── middleware.ts                 # Protection des routes
│
├── .env.example                  # Template des variables d'environnement
├── .env.local                    # Variables locales (git ignoré)
│
├── next.config.js                # Configuration Next.js
├── tailwind.config.js            # Configuration Tailwind CSS
├── tsconfig.json                 # Configuration TypeScript
│
├── README.md                     # Ce fichier
├── VERCEL_SETUP.md              # Guide déploiement Vercel
├── SUPABASE_SETUP.md            # Guide configuration Supabase
└── CORRECTIONS_APPLIQUÉES.md    # Détails des corrections
```

---

## 🔐 CONFIGURATION SUPABASE

### Schéma de base de données requis

```sql
-- Table profiles (étend auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gerant', 'revendeur')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy : Lecture de son propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy : Mise à jour de son propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'revendeur'); -- Rôle par défaut
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**📖 Setup complet : [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

---

## 🧪 TESTS

### Comptes de test

Utilise ces comptes pour tester l'authentification :

```
Admin :
  Email : admin@mg.com
  Mot de passe : [ton mot de passe]

Gérant :
  Email : gerant@mg.com
  Mot de passe : [ton mot de passe]

Revendeur :
  Email : revendeur@mg.com
  Mot de passe : [ton mot de passe]
```

### Vérifications

```bash
# Tester le build localement
npm run build

# Si succès, le build Vercel passera aussi
npm start
```

### Checklist de test

- [ ] Page d'accueil accessible (`/`)
- [ ] Page login accessible (`/login`)
- [ ] Authentification fonctionne
- [ ] Redirection post-login vers le bon dashboard
- [ ] Routes protégées redirigent vers `/login` si non connecté
- [ ] Déconnexion fonctionne
- [ ] Les 3 rôles ont leur dashboard distinct

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### ❌ "Variables Supabase manquantes"

**En local** :
```bash
# Vérifie que .env.local existe
ls -la .env.local

# Vérifie le contenu
cat .env.local
```

**Sur Vercel** :
1. Va dans Settings > Environment Variables
2. Vérifie que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` existent
3. Coche les 3 environnements (Production, Preview, Development)
4. Redéploie

### ❌ Erreur de build

```bash
# Nettoie et rebuild
rm -rf .next node_modules
npm install
npm run build
```

### ❌ Auth ne fonctionne pas

1. Vérifie que l'URL Supabase est correcte (finit par `.supabase.co`)
2. Vérifie que tu utilises la clé **anon** (pas service_role)
3. Vérifie que la table `profiles` existe dans Supabase
4. Vérifie les RLS policies dans Supabase

**📖 Plus de solutions : [VERCEL_SETUP.md - Section Dépannage](./VERCEL_SETUP.md#-dépannage)**

---

## 📚 DOCUMENTATION

| Fichier | Description |
|---------|-------------|
| **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** | Guide complet de déploiement Vercel |
| **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Configuration de la base de données |
| **[CORRECTIONS_APPLIQUÉES.md](./CORRECTIONS_APPLIQUÉES.md)** | Détails techniques des corrections |
| **[.env.example](./.env.example)** | Template des variables d'environnement |

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

### Déploiement continu (GitHub + Vercel)

```bash
# 1. Développe en local
git checkout -b feature/nouvelle-fonctionnalite
# ... code ...

# 2. Teste localement
npm run build
npm start

# 3. Push vers GitHub
git add .
git commit -m "Ajout de la nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite

# 4. Vercel crée automatiquement un preview deployment
# 5. Merge vers main pour déployer en production
```

### Structure des branches recommandée

- `main` → Production (Vercel auto-deploy)
- `develop` → Staging (Vercel preview)
- `feature/*` → Nouvelles fonctionnalités
- `fix/*` → Corrections de bugs

---

## 🎯 ROADMAP

### Phase 1 - Auth & Structure ✅ (Complété)
- [x] Configuration Next.js + Supabase
- [x] Système d'authentification
- [x] Protection des routes par rôle
- [x] Dashboards de base

### Phase 2 - Gestion des utilisateurs ⏳ (En cours)
- [ ] CRUD utilisateurs (Admin)
- [ ] Assignation des rôles
- [ ] Gestion des permissions
- [ ] Profils utilisateurs

### Phase 3 - Gestion de stock
- [ ] CRUD produits
- [ ] Catégories de produits
- [ ] Inventaire en temps réel
- [ ] Alertes de stock bas

### Phase 4 - Transactions
- [ ] Système de commandes
- [ ] Facturation
- [ ] Historique des transactions
- [ ] Rapports de ventes

### Phase 5 - Optimisations
- [ ] Tests E2E (Playwright)
- [ ] Performance monitoring
- [ ] Analytics
- [ ] PWA (mode hors-ligne)

---

## 🤝 CONTRIBUTION

Ce projet est actuellement en développement privé. Pour contribuer :

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

---

## 📄 LICENCE

Ce projet est propriétaire et confidentiel.

---

## 👤 AUTEUR

**HeriMaAndria**
- GitHub: [@HeriMaAndria](https://github.com/HeriMaAndria)

---

## 🙏 REMERCIEMENTS

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Plateforme de déploiement

---

## 📞 SUPPORT

Problème ? Consulte dans l'ordre :

1. 📖 [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Problèmes de déploiement
2. 📖 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Problèmes d'auth/database
3. 🐛 [GitHub Issues](https://github.com/HeriMaAndria/MG-inventory/issues) - Ouvre un ticket
4. 💬 [Discussions](https://github.com/HeriMaAndria/MG-inventory/discussions) - Questions générales

---

**Dernière mise à jour** : 10 février 2026  
**Statut** : ✅ Production Ready
