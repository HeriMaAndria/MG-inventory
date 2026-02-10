# 🧱 MG Inventory - Guide de déploiement

## 📌 Vue d'ensemble
Application de gestion commerciale avec système de rôles (Admin/Gérant/Revendeur).

---

## 🚀 DÉPLOIEMENT VERCEL (depuis Android)

### 1️⃣ Préparer le repo GitHub

```bash
# Sur ton Android (dans Termux ou autre terminal Git)
cd /chemin/vers/ton/projet
git init
git add .
git commit -m "Initial setup - Next.js + Supabase"
git branch -M main
git remote add origin https://github.com/HeriMaAndria/MG-inventory.git
git push -u origin main
```

### 2️⃣ Connecter à Vercel

1. Va sur **vercel.com**
2. Clique **"Add New Project"**
3. Importe depuis GitHub : `HeriMaAndria/MG-inventory`
4. Vercel détecte automatiquement Next.js ✅
5. **Configure les variables d'environnement** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique **Deploy**

### 3️⃣ Test automatique
À chaque `git push`, Vercel redéploie automatiquement.

---

## 📁 STRUCTURE DU PROJET

```
MG-inventory/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Routes protégées
│   │   ├── admin/           # Dashboard Admin
│   │   ├── gerant/          # Dashboard Gérant
│   │   └── revendeur/       # Dashboard Revendeur
│   ├── api/                 # Routes API
│   ├── login/               # Page de connexion
│   └── layout.tsx           # Layout racine
├── components/              # Composants réutilisables
│   ├── ui/                  # Composants UI de base
│   └── auth/                # Composants d'authentification
├── lib/                     # Utilitaires
│   ├── supabase/            # Client Supabase
│   └── utils.ts             # Fonctions helpers
├── middleware.ts            # Protection des routes
├── .env.local               # Variables d'environnement (ne pas commit)
└── package.json             # Dépendances
```

---

## 🔐 CONFIGURATION SUPABASE

### Créer les tables

```sql
-- Table users (étendue de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gerant', 'revendeur')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy : chaque user voit son propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

---

## 🧪 TESTER LOCALEMENT (optionnel)

Si tu as Node.js installé :
```bash
npm install
npm run dev
# Ouvre http://localhost:3000
```

Sinon, teste directement sur Vercel preview.

---

## 📝 PROCHAINES ÉTAPES

1. ✅ Déployer la structure de base
2. ⏳ Créer la page de login
3. ⏳ Implémenter l'auth Supabase
4. ⏳ Système de redirection par rôle
5. ⏳ Dashboards pour chaque rôle

---

## 🐛 DEBUGGING

### Erreur de build Vercel
- Vérifie `package.json` (pas d'erreur de syntaxe)
- Vérifie `.env.local` sur Vercel (variables bien renseignées)

### Auth ne fonctionne pas
- Vérifie l'URL Supabase (sans `/` à la fin)
- Vérifie la clé `anon` (pas la clé `service_role`)

---

## 📚 RESSOURCES

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vercel Deployment](https://vercel.com/docs)
