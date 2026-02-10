# 🔐 Configuration Supabase - Guide complet

## 🎯 Objectif
Configurer Supabase pour gérer l'authentification et les rôles utilisateurs.

---

## ÉTAPE 1 : Créer un projet Supabase

1. Va sur **https://supabase.com**
2. Clique sur "New project"
3. Choisis un nom : `mg-inventory`
4. Définis un mot de passe database (garde-le précieusement)
5. Choisis la région la plus proche (Europe West par exemple)
6. Clique "Create new project"

⏳ Attends ~2 minutes que le projet se crée.

---

## ÉTAPE 2 : Récupérer les clés d'API

1. Dans ton projet Supabase, va dans **Settings** (⚙️)
2. Clique sur **API**
3. Tu verras :
   - **Project URL** : `https://xxxxxxx.supabase.co`
   - **anon public** : `eyJhbG...` (très longue clé)

4. **Copie ces deux valeurs** et ajoute-les dans Vercel :
   - Va sur ton projet Vercel
   - Settings → Environment Variables
   - Ajoute :
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...
     ```

⚠️ **Redéploie** après avoir ajouté les variables.

---

## ÉTAPE 3 : Créer la table `profiles`

1. Dans Supabase, va dans **SQL Editor**
2. Clique "New query"
3. Colle ce code :

```sql
-- Table pour stocker les rôles des utilisateurs
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'gerant', 'revendeur')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy : chaque user peut lire son propre profil
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy : seuls les admins peuvent tout voir
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

4. Clique **Run** (en bas à droite)
5. Tu devrais voir : ✅ "Success. No rows returned"

---

## ÉTAPE 4 : Créer des utilisateurs de test

Retourne dans **SQL Editor** et exécute :

```sql
-- Créer 3 utilisateurs de test
-- Note : remplace les emails si tu veux

-- 1. Admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@mg.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Associe le rôle admin
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, 'admin@mg.com', 'admin', 'Administrateur Test'
FROM auth.users WHERE email = 'admin@mg.com';

-- 2. Gérant
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'gerant@mg.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, 'gerant@mg.com', 'gerant', 'Gérant Test'
FROM auth.users WHERE email = 'gerant@mg.com';

-- 3. Revendeur
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'revendeur@mg.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, 'revendeur@mg.com', 'revendeur', 'Revendeur Test'
FROM auth.users WHERE email = 'revendeur@mg.com';
```

⚠️ **ERREUR POSSIBLE** : Si tu as une erreur, c'est peut-être que Supabase a changé la structure de `auth.users`. Dans ce cas, utilise plutôt l'interface web :

1. Va dans **Authentication** → **Users**
2. Clique "Add user"
3. Ajoute manuellement :
   - Email : `admin@mg.com`
   - Password : `password123`
   - Auto Confirm User : ✅

4. Ensuite, retourne dans **SQL Editor** et ajoute le rôle :
```sql
INSERT INTO public.profiles (id, email, role, full_name)
SELECT id, 'admin@mg.com', 'admin', 'Administrateur Test'
FROM auth.users WHERE email = 'admin@mg.com';
```

Répète pour `gerant@mg.com` et `revendeur@mg.com`.

---

## ÉTAPE 5 : Vérifier que tout fonctionne

1. Va sur **Table Editor** dans Supabase
2. Sélectionne la table `profiles`
3. Tu devrais voir 3 lignes avec les 3 rôles

Si c'est bon → passe à l'étape suivante !

---

## ✅ PROCHAINE ÉTAPE

Maintenant que Supabase est configuré, on va :
1. Pousser le code sur GitHub
2. Déployer sur Vercel
3. Tester la connexion avec les 3 comptes

---

## 🐛 DEBUGGING

### Erreur : "Invalid API key"
→ Vérifie que tu as bien copié la clé `anon public` (pas la clé `service_role`)

### Erreur : "Table profiles does not exist"
→ Tu as oublié de créer la table, retourne à l'étape 3

### Erreur de connexion
→ Vérifie que les users sont bien dans **Authentication** → **Users**
