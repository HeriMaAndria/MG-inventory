# 📖 Guide de Configuration Supabase - MG-Inventory

## Table des matières
1. [Créer un projet Supabase](#créer-un-projet)
2. [Configurer l'authentification](#authentification)
3. [Créer la base de données](#base-de-données)
4. [Configurer la sécurité RLS](#sécurité-rls)
5. [Tester la connexion](#tests)
6. [Migration des données](#migration)

---

## 🎯 Créer un projet Supabase

### Étape 1: Créer un compte
1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "Start your project"
3. S'inscrire avec Google ou GitHub

### Étape 2: Créer un nouveau projet
1. Cliquer sur "New Project"
2. Remplir les informations:
   - **Name**: `mg-inventory`
   - **Database Password**: Un mot de passe fort (notez-le!)
   - **Region**: Choisir une région proche (ex: Paris pour l'Europe)
3. Cliquer "Create new project"

### Étape 3: Récupérer les clés
Aller à `Settings > API` et copier:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** → `VITE_SUPABASE_ANON_KEY`

Créer le fichier `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🔐 Configurer l'Authentification

### Étape 1: Activer Email/Password
1. Aller à `Authentication > Providers`
2. Assurez-vous que **Email** est activé
3. Cliquer sur Email pour le configurer:
   - ✅ Enable Email/Password Auth

### Étape 2: Configurer les URLs de redirection
1. Aller à `Authentication > URL Configuration`
2. Ajouter les URLs:
   ```
   http://localhost:5173
   http://localhost:3000
   https://votre-domaine.com
   ```

### Étape 3: Configurer les emails
1. Aller à `Authentication > Email Templates`
2. Vous pouvez personnaliser les emails de confirmation/réinitialisation

---

## 📊 Créer la Base de Données

### Étape 1: Aller à l'éditeur SQL

1. Cliquer sur "SQL Editor" dans la sidebar
2. Cliquer sur "New query"

### Étape 2: Créer les tables

Exécuter ce script SQL complet:

```sql
-- ============ EXTENSION ============
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ TABLE PROFILES ============
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'revendeur' CHECK (role IN ('revendeur', 'admin')),
  company_name TEXT,
  responsible_number TEXT,
  phone TEXT,
  address TEXT,
  max_draft_invoices INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TABLE USER_SETTINGS ============
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  company_activity TEXT,
  company_address TEXT,
  company_stat TEXT,
  company_nif TEXT,
  company_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ TABLE STOCK ============
CREATE TABLE stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'Sans catégorie',
  name TEXT NOT NULL,
  reference TEXT,
  purchase_price DECIMAL(12,2),
  purchase_unit TEXT DEFAULT 'pièce',
  unit_price DECIMAL(12,2),
  quantity_available DECIMAL(12,2) DEFAULT 0,
  min_quantity DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_user ON stock(user_id);
CREATE INDEX idx_stock_reference ON stock(reference);

-- ============ TABLE CLIENTS ============
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  total_purchases INTEGER DEFAULT 0,
  last_purchase_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user ON clients(user_id);

-- ============ TABLE INVOICES ============
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  draft_number TEXT,
  official_number TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('commande', 'proforma', 'avoir')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending', 'confirmed', 'sent', 'paid', 'delivered', 'cancelled', 'returned'
  )),
  date DATE NOT NULL,
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES profiles(id),
  client_data JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  notes TEXT,
  submitted_for_validation BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ,
  validation_comment TEXT,
  is_frozen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_draft_number ON invoices(draft_number);
CREATE INDEX idx_invoices_official_number ON invoices(official_number) WHERE official_number IS NOT NULL;
CREATE INDEX idx_invoices_pending ON invoices(status) WHERE status = 'pending';

-- ============ TABLE INVOICE_NUMBER_SEQUENCE ============
CREATE TABLE invoice_number_sequence (
  year INTEGER PRIMARY KEY,
  last_number INTEGER DEFAULT 0
);

-- ============ TABLE INVOICE_HISTORY ============
CREATE TABLE invoice_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES profiles(id),
  old_status TEXT,
  new_status TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_history_invoice ON invoice_history(invoice_id);

-- ============ FONCTION POUR GÉNÉRER LE NUMÉRO OFFICIEL ============
CREATE OR REPLACE FUNCTION public.get_next_invoice_number()
RETURNS TEXT AS $$
DECLARE
  current_year INTEGER;
  next_num INTEGER;
  result TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  
  INSERT INTO invoice_number_sequence (year, last_number)
  VALUES (current_year, 0)
  ON CONFLICT (year) DO NOTHING;
  
  UPDATE invoice_number_sequence
  SET last_number = last_number + 1
  WHERE year = current_year
  RETURNING last_number INTO next_num;
  
  result := 'FACT-' || current_year::TEXT || '-' || LPAD(next_num::TEXT, 3, '0');
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============ TRIGGER POUR CRÉER LE PROFIL AU SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'revendeur');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Étape 3: Copier le script
1. Copier tout le code ci-dessus
2. Cliquer sur "New query" dans SQL Editor
3. Coller le code
4. Cliquer sur "Run"

✅ Si pas d'erreur, les tables sont créées!

---

## 🔒 Configurer la Sécurité RLS (Row Level Security)

### ⚠️ IMPORTANT: D'abord désactiver RLS temporairement

1. Aller à `Authentication > Policies`
2. Pour chaque table, cliquer sur "Disable RLS" d'abord (pour tester)

### Activer RLS par table

Exécuter ce script SQL:

```sql
-- ============ ENABLE RLS ============
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_history ENABLE ROW LEVEL SECURITY;

-- ============ PROFILES ============
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============ USER_SETTINGS ============
CREATE POLICY "Users can read their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- ============ STOCK ============
CREATE POLICY "Users can read their own stock"
  ON stock FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their stock"
  ON stock FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their stock"
  ON stock FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their stock"
  ON stock FOR DELETE
  USING (auth.uid() = user_id);

-- ============ CLIENTS ============
CREATE POLICY "Users can read their own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

-- ============ INVOICES ============
CREATE POLICY "Users can read their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own draft invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft' AND is_frozen = false);

CREATE POLICY "Admins can update any invoice"
  ON invoices FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- ============ INVOICE_HISTORY ============
CREATE POLICY "Anyone can read invoice history"
  ON invoice_history FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert history"
  ON invoice_history FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
```

---

## 🧪 Tester la Connexion

### Étape 1: Vérifier les variables d'environnement

Fichier `.env.local`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### Étape 2: Tester l'inscription

```bash
npm run dev
```

1. Aller à `http://localhost:5173/signup`
2. Créer un compte test
3. Vérifier que le profil est créé dans la table `profiles`

### Étape 3: Vérifier dans Supabase

1. Aller à `Authentication > Users` → Voir l'utilisateur créé
2. Aller à `Table Editor > profiles` → Voir le profil
3. Aller à `SQL Editor` et exécuter:
```sql
SELECT * FROM profiles;
SELECT * FROM auth.users;
```

---

## 👤 Créer un Admin

Pour promouvoir un utilisateur en admin:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'the-user-id-here';
```

Ou depuis la console Supabase:
1. Aller à `Table Editor > profiles`
2. Cliquer sur l'utilisateur
3. Changer `role` de `revendeur` à `admin`

---

## 📤 Migration des Données Existantes

### Si vous avez des données depuis la version localStorage:

#### 1. Exporter depuis localStorage (Ancienne app)
```javascript
// Dans la console du navigateur
const data = JSON.parse(localStorage.getItem('invoices_v2'))
console.log(JSON.stringify(data, null, 2))
// Copier et sauvegarder
```

#### 2. Importer dans Supabase
```sql
-- Adapter les ID et insérer dans les tables
INSERT INTO invoices (user_id, type, status, date, client_data, items, total)
VALUES (
  'user-id-uuid',
  'commande',
  'confirmed',
  '2026-02-10',
  '{"name": "Client Name"}',
  '[{"description": "Item", "quantity": 1}]',
  1000.00
);
```

---

## 🐛 Troubleshooting

### Erreur: "Invalid API Key"
- Vérifier `.env.local`
- Régénérer les clés dans Supabase

### Erreur: "new user insert denied by RLS"
- Vérifier que le trigger `handle_new_user()` existe
- Vérifier les policies RLS

### Erreur: "permission denied"
- S'assurer que l'utilisateur est connecté
- Vérifier les RLS policies

### La base ne se crée pas
- Vérifier le mot de passe du projet
- Essayer d'exécuter les requêtes une par une

---

## 🚀 Prêt!

Vous pouvez maintenant:
1. ✅ Créer des comptes
2. ✅ Créer des factures
3. ✅ Valider (admin)
4. ✅ Accéder à tous les services

**Prochaine étape**: Lancer `npm run dev` et tester l'application!

---

## 📚 Ressources Utiles

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.postgresql.org/docs/current/sql.html)

---

**Version**: 1.0  
**Dernière mise à jour**: Février 2026
