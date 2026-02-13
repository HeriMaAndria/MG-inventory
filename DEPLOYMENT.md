# Guide de Déploiement - MG Inventory v2

## 📋 Prérequis

- Compte Vercel
- Compte Supabase
- Repository Git (GitHub, GitLab, ou Bitbucket)

## 🔧 Étape 1: Configuration Supabase

### 1.1 Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Choisir une région proche de vos utilisateurs
4. Noter les credentials:
   - `Project URL`
   - `anon public key`

### 1.2 Exécuter la migration

1. Aller dans l'éditeur SQL de Supabase
2. Copier le contenu de `supabase-migration.sql`
3. Exécuter la migration
4. Vérifier que toutes les tables sont créées

### 1.3 Configurer l'authentification

1. Aller dans Authentication > Providers
2. Activer Email/Password
3. Configurer les URL de redirection:
   - `https://your-domain.vercel.app/**`

### 1.4 Activer Realtime (optionnel)

1. Aller dans Database > Replication
2. Activer Realtime pour la table `notifications`

## 🚀 Étape 2: Déploiement sur Vercel

### 2.1 Préparer le repository

1. Pusher votre code sur GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2.2 Importer dans Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer votre repository GitHub
4. Vercel détectera automatiquement Next.js

### 2.3 Configurer le projet

**Framework Preset**: Next.js  
**Root Directory**: `apps/web`  
**Build Command**: `npm run build` (ou laisser par défaut)  
**Output Directory**: `.next` (ou laisser par défaut)

### 2.4 Variables d'environnement

Ajouter ces variables dans Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2.5 Déployer

1. Cliquer sur "Deploy"
2. Attendre la fin du build
3. Votre app est en ligne! 🎉

## 🔐 Étape 3: Sécurité Post-Déploiement

### 3.1 Configurer les domaines autorisés

Dans Supabase > Authentication > URL Configuration:

```
Site URL: https://your-domain.vercel.app
Redirect URLs: https://your-domain.vercel.app/**
```

### 3.2 Vérifier RLS

Tester que les politiques RLS fonctionnent:
- Un utilisateur normal ne doit voir que ses factures
- Un gérant doit voir toutes les factures

### 3.3 Configurer CORS (si nécessaire)

Dans Supabase > API > API Settings:
- Ajouter votre domaine Vercel aux origines autorisées

## 👥 Étape 4: Créer les Premiers Utilisateurs

### 4.1 Via Supabase Dashboard

1. Aller dans Authentication > Users
2. Cliquer sur "Add user"
3. Créer un utilisateur admin:
   - Email: admin@votre-domaine.com
   - Auto-confirm: ON

### 4.2 Via SQL

```sql
-- Insérer dans la table users après création du compte Supabase
INSERT INTO public.users (id, email, full_name, role, seller_reference)
VALUES (
  'auth-user-uuid', -- UUID de auth.users
  'admin@votre-domaine.com',
  'Admin Principal',
  'admin',
  'ADM-001'
);
```

## 📊 Étape 5: Données de Test

### 5.1 Importer des données initiales

Vous pouvez utiliser le script SQL suivant pour insérer des données de test:

```sql
-- Clients de test
INSERT INTO public.clients (name, email, phone, address, city) VALUES
('Client Test 1', 'client1@test.mg', '+261 34 00 000 01', 'Adresse 1', 'Antananarivo'),
('Client Test 2', 'client2@test.mg', '+261 34 00 000 02', 'Adresse 2', 'Antananarivo');

-- Produits de test
INSERT INTO public.products (name, reference, category, base_unit) VALUES
('Produit Test', 'PROD-001', 'Test', 'piece');

-- Récupérer l'ID du produit
-- Puis créer une variante
INSERT INTO public.product_variants (
  product_id, name, sku, unit_type,
  purchase_price, manager_sale_price,
  stock_quantity, stock_alert_threshold
) VALUES (
  'product-uuid', -- UUID du produit créé
  'Variante Standard',
  'PROD-001-STD',
  'piece',
  10000,
  15000,
  100,
  20
);
```

## 🔄 Étape 6: CI/CD

### 6.1 Déploiement automatique

Vercel déploie automatiquement:
- Production: branche `main`
- Preview: toutes les autres branches

### 6.2 Environnements

Créer différents environnements dans Vercel:
- Production: main
- Staging: develop
- Preview: feature branches

Configurer des variables d'environnement différentes pour chaque env.

## 🐛 Résolution de Problèmes

### Problème: Build échoue

**Solution**: Vérifier les logs dans Vercel:
1. Aller dans Deployments
2. Cliquer sur le déploiement échoué
3. Lire les logs d'erreur

### Problème: Erreur de connexion Supabase

**Solution**: Vérifier:
1. Les variables d'environnement sont correctes
2. L'URL et la clé correspondent au bon projet
3. Le projet Supabase est actif

### Problème: RLS bloque les requêtes

**Solution**: Vérifier:
1. L'utilisateur est bien authentifié
2. Les politiques RLS sont correctes
3. Les rôles sont bien assignés

## 📱 Post-Déploiement

### Tester l'application

1. Créer un compte
2. Se connecter
3. Créer une facture test
4. Vérifier que tout fonctionne

### Monitoring

1. Activer Vercel Analytics
2. Configurer Supabase Logs
3. Surveiller les erreurs

### Backup

1. Configurer les backups automatiques dans Supabase
2. Exporter régulièrement les données critiques

## 🎯 Checklist Finale

- [ ] Migration Supabase exécutée
- [ ] Variables d'env configurées
- [ ] Application déployée sur Vercel
- [ ] Domaines configurés
- [ ] RLS testé
- [ ] Utilisateur admin créé
- [ ] Données de test importées
- [ ] Tests de bout en bout passés
- [ ] Documentation à jour
- [ ] Monitoring activé

## 🆘 Support

Pour toute question ou problème:
1. Vérifier la documentation
2. Consulter les logs Vercel
3. Vérifier les logs Supabase
4. Contacter l'équipe de développement

---

**Bon déploiement! 🚀**
