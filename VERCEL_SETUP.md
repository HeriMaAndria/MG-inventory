# 🚀 DÉPLOIEMENT VERCEL - MG INVENTORY

Ce guide explique comment déployer MG Inventory sur Vercel avec Supabase.

---

## ✅ PRÉREQUIS

- [ ] Un compte Vercel (gratuit) : https://vercel.com/signup
- [ ] Un projet Supabase configuré (voir SUPABASE_SETUP.md)
- [ ] Les 2 variables d'environnement Supabase :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📦 ÉTAPE 1 : IMPORTER LE PROJET

### Option A - Depuis GitHub (recommandé)

1. **Push ton code sur GitHub** (si pas déjà fait)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ton-username/mg-inventory.git
   git push -u origin main
   ```

2. **Importer dans Vercel**
   - Va sur https://vercel.com/new
   - Clique sur "Import Git Repository"
   - Sélectionne ton repo GitHub
   - Clique sur "Import"

### Option B - Upload direct (rapide mais moins recommandé)

1. **Créer un fichier ZIP**
   ```bash
   # Depuis la racine du projet
   zip -r mg-inventory.zip . -x "node_modules/*" ".next/*" ".git/*"
   ```

2. **Upload sur Vercel**
   - Va sur https://vercel.com/new
   - Clique sur "Deploy" ou glisse-dépose ton ZIP
   - Vercel va détecter automatiquement Next.js

---

## 🔐 ÉTAPE 2 : CONFIGURER LES VARIABLES D'ENVIRONNEMENT

**CRITIQUE** : Sans ces variables, le déploiement échouera ou l'app ne fonctionnera pas.

### Dans le Dashboard Vercel :

1. **Pendant l'import** (première fois) :
   - Clique sur "Environment Variables"
   - Ajoute les 2 variables (voir ci-dessous)
   - Clique sur "Deploy"

2. **Après le déploiement** (pour modifier) :
   - Va dans ton projet Vercel
   - Settings → Environment Variables
   - Add New

### Variables à ajouter :

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ton-projet.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production, ✅ Preview, ✅ Development
```

⚠️ **IMPORTANT** :
- Coche les 3 environnements (Production, Preview, Development)
- Utilise bien la clé **anon** (pas service_role !)
- Les valeurs viennent de Supabase Dashboard > Settings > API

---

## 🏗️ ÉTAPE 3 : DÉPLOYER

1. **Premier déploiement** :
   - Si tu as suivi l'étape 1, c'est automatique
   - Vercel va :
     - Détecter Next.js
     - Installer les dépendances (`npm install`)
     - Builder l'application (`npm run build`)
     - Déployer

2. **Suivre le build** :
   - Tu verras les logs en temps réel
   - Le build prend ~2-3 minutes
   - ✅ "Build Completed" = succès !
   - ❌ Si erreur → voir section "Dépannage" ci-dessous

3. **Accéder à ton app** :
   - URL fournie par Vercel : `https://ton-projet.vercel.app`
   - Teste `/login` pour vérifier l'auth

---

## 🔄 ÉTAPE 4 : REDÉPLOIEMENTS AUTOMATIQUES

Si tu as connecté GitHub :
- ✅ Chaque `git push` redéploie automatiquement
- ✅ Les Pull Requests ont leur propre preview
- ✅ Seul la branche `main` va en production

Si tu as uploadé manuellement :
- Crée un nouveau ZIP
- Upload sur Vercel
- Ou connecte GitHub pour automatiser

---

## 🎯 VÉRIFICATION POST-DÉPLOIEMENT

Checklist pour confirmer que tout fonctionne :

1. **✅ Build réussi**
   - Va dans Vercel Dashboard > ton projet > Deployments
   - Le dernier déploiement affiche "Ready"

2. **✅ Variables configurées**
   - Settings > Environment Variables
   - Les 2 variables Supabase sont présentes

3. **✅ Pages accessibles**
   - Visite `https://ton-projet.vercel.app`
   - Page d'accueil s'affiche
   - `/login` s'affiche (même si pas encore connecté)

4. **✅ Authentification fonctionnelle**
   - Va sur `/login`
   - Essaye de te connecter avec un compte Supabase
   - Tu dois être redirigé vers ton dashboard

5. **✅ Middleware fonctionne**
   - Sans connexion, essaye d'accéder `/admin`
   - Tu dois être redirigé vers `/login`
   - Avec connexion, tu accèdes au dashboard

---

## 🐛 DÉPANNAGE

### ❌ Erreur : "Variables Supabase manquantes"

**Cause** : Variables d'environnement non configurées dans Vercel

**Solution** :
1. Va dans Settings > Environment Variables
2. Ajoute `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Coche les 3 environnements (Production, Preview, Development)
4. Clique sur "Save"
5. Va dans Deployments
6. Clique sur les "..." du dernier déploiement
7. Clique sur "Redeploy"

---

### ❌ Erreur de build : "Module not found"

**Cause** : Dépendances manquantes ou incompatibles

**Solution** :
```bash
# En local
rm -rf node_modules package-lock.json
npm install
npm run build  # Teste le build localement
git add .
git commit -m "Fix dependencies"
git push
```

---

### ❌ L'authentification ne fonctionne pas

**Causes possibles** :

1. **Variables mal configurées**
   - Vérifie que l'URL finit bien par `.supabase.co`
   - Vérifie que la clé commence par `eyJ`
   - Pas d'espaces avant/après les valeurs

2. **Supabase pas configuré**
   - Va dans Supabase Dashboard
   - Vérifie que la table `profiles` existe
   - Vérifie les Row Level Security (RLS) policies
   - Voir SUPABASE_SETUP.md

3. **CORS issues**
   - Va dans Supabase > Authentication > URL Configuration
   - Ajoute ton URL Vercel dans "Site URL"
   - Ajoute `https://ton-projet.vercel.app/*` dans "Redirect URLs"

---

### ❌ Page 404 après le login

**Cause** : Le rôle n'existe pas dans la table profiles

**Solution** :
```sql
-- Dans Supabase SQL Editor
SELECT * FROM profiles;

-- Si vide ou rôle incorrect, update :
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'ton@email.com';
```

---

### ❌ Erreurs 500 ou "Internal Server Error"

**Debug** :
1. Va dans Vercel Dashboard > ton projet > Functions
2. Clique sur "Logs"
3. Cherche les erreurs détaillées
4. Souvent lié à Supabase : vérifie les credentials

---

## 🔧 COMMANDES UTILES

```bash
# Tester le build en local avant de déployer
npm run build
npm start

# Voir les logs en temps réel (si connecté à Vercel CLI)
vercel logs --follow

# Redéployer manuellement
vercel --prod

# Voir les variables d'environnement
vercel env ls
```

---

## 🚀 OPTIMISATIONS POST-DÉPLOIEMENT

### 1. Ajouter un domaine personnalisé

- Settings > Domains
- Ajoute ton domaine (ex: mg-inventory.com)
- Suis les instructions DNS

### 2. Activer les Analytics

- Analytics (dans le menu)
- Gratuit pour voir les visites

### 3. Configurer les Preview Deployments

- Settings > Git
- Configure quelles branches déployer automatiquement

### 4. Ajouter des Secrets

Pour les vraies variables sensibles (API keys privées) :
```bash
vercel secrets add my-secret-key valeur-secrete
```

---

## 📚 RESSOURCES

- [Documentation Vercel](https://vercel.com/docs)
- [Variables d'environnement Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase avec Vercel](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

## ✅ CHECKLIST FINALE

Avant de considérer le déploiement comme réussi :

- [ ] Build passe sans erreur
- [ ] Variables d'environnement configurées
- [ ] Page d'accueil accessible
- [ ] Login fonctionne
- [ ] Redirection post-login fonctionne
- [ ] Middleware protège les routes
- [ ] Déconnexion fonctionne
- [ ] Les 3 rôles (admin, gerant, revendeur) fonctionnent
- [ ] Pas d'erreurs dans les logs Vercel

**Si tous ces points sont verts → 🎉 Déploiement réussi !**

---

## 💡 CONSEIL PRO

Configure un workflow GitHub Actions pour tester le build avant le merge :

```yaml
# .github/workflows/test.yml
name: Test Build
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

Ça évite de déployer du code cassé en production ! 🛡️
