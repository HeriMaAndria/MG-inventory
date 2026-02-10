# 📱 Guide de déploiement depuis Android

## 🎯 Objectif
Déployer MG Inventory sur Vercel depuis ton téléphone Android.

---

## PRÉREQUIS

Tu as besoin de :
- ✅ Un compte GitHub
- ✅ Un compte Vercel (gratuit)
- ✅ Un compte Supabase (gratuit)
- ✅ Termux ou une app Git pour Android

---

## ÉTAPE 1 : Préparer les fichiers

### Option A : Depuis ton ordinateur (recommandé)

1. Télécharge tous les fichiers que je t'ai fournis
2. Mets-les dans une structure de dossiers comme indiqué dans le README
3. Passe à l'étape 2

### Option B : Depuis Android directement

Si tu utilises **Termux** :

```bash
# Installe Git
pkg install git

# Installe Node.js (optionnel, juste pour vérifier)
pkg install nodejs

# Crée le dossier du projet
cd ~
mkdir mg-inventory
cd mg-inventory
```

Ensuite, copie tous les fichiers que je t'ai donnés dans ce dossier.

---

## ÉTAPE 2 : Pousser sur GitHub

### 2.1 Initialise le repo

```bash
cd /chemin/vers/mg-inventory

git init
git add .
git commit -m "Initial commit - Auth + Rôles"
```

### 2.2 Crée le repo sur GitHub

1. Va sur **github.com** (depuis ton navigateur mobile)
2. Clique sur **+** → **New repository**
3. Nom : `MG-inventory`
4. Visibilité : Private (recommandé)
5. **NE COCHE PAS** "Add README" (on en a déjà un)
6. Clique **Create repository**

### 2.3 Pousse le code

GitHub te donne des commandes, copie-les :

```bash
git remote add origin https://github.com/TonUsername/MG-inventory.git
git branch -M main
git push -u origin main
```

Si on te demande un login :
- Username : ton username GitHub
- Password : **pas ton mot de passe**, mais un **Personal Access Token**

#### Comment créer un token GitHub ?

1. Va dans **Settings** (sur GitHub)
2. **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token**
4. Nom : "Termux Push"
5. Coche : `repo` (full control)
6. Génère et **copie le token** (tu ne le reverras plus)
7. Utilise ce token comme mot de passe

---

## ÉTAPE 3 : Configurer Supabase

⚠️ **IMPORTANT** : Fais d'abord la configuration Supabase en suivant `SUPABASE_SETUP.md`

Une fois fait, tu auras :
- Une URL Supabase
- Une clé anon

---

## ÉTAPE 4 : Déployer sur Vercel

### 4.1 Connecte GitHub à Vercel

1. Va sur **vercel.com** (navigateur mobile)
2. Clique **Add New Project**
3. **Import Git Repository**
4. Sélectionne **GitHub**
5. Autorise Vercel à accéder à tes repos
6. Sélectionne `MG-inventory`

### 4.2 Configure les variables d'environnement

Avant de déployer, clique sur **Environment Variables** :

Ajoute :
- `NEXT_PUBLIC_SUPABASE_URL` = `https://ton-projet.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbG...` (ta clé anon)

### 4.3 Déploie

1. Clique **Deploy**
2. ⏳ Attends ~2-3 minutes
3. ✅ Tu verras "Congratulations! Your project is live"

---

## ÉTAPE 5 : Tester

1. Clique sur le lien de ton site (ex: `mg-inventory.vercel.app`)
2. Tu devrais voir la page d'accueil
3. Va sur `/login`
4. Teste avec :
   - `admin@mg.com` / `password123` → redirige vers `/admin`
   - `gerant@mg.com` / `password123` → redirige vers `/gerant`
   - `revendeur@mg.com` / `password123` → redirige vers `/revendeur`

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

À partir de maintenant, voici comment tu vas travailler :

### 1️⃣ Édite les fichiers
Sur Android, utilise un éditeur de texte ou Termux.

### 2️⃣ Commit + Push
```bash
git add .
git commit -m "Description de ce que tu as changé"
git push
```

### 3️⃣ Vercel redéploie automatiquement
- Attends ~1 minute
- Rafraîchis ton site
- Tes changements sont en ligne ✅

---

## 🐛 PROBLÈMES FRÉQUENTS

### Build failed sur Vercel

**Erreur : "Cannot find module"**
→ Vérifie que tous les fichiers sont bien poussés sur GitHub

**Erreur : "Invalid API key"**
→ Vérifie les variables d'environnement dans Vercel

### Je ne peux pas push sur GitHub

**Erreur : "Authentication failed"**
→ Utilise un Personal Access Token, pas ton mot de passe

### Le site est blanc

**Rien ne s'affiche**
→ Ouvre la console (F12 sur navigateur) et regarde les erreurs
→ Vérifie que les variables d'environnement sont bien dans Vercel

---

## ✅ CHECKLIST DE VÉRIFICATION

Avant de me dire "ça marche pas", vérifie :

- [ ] Les variables d'environnement sont dans Vercel
- [ ] La table `profiles` existe dans Supabase
- [ ] Les 3 users existent dans Supabase Auth
- [ ] Tu as bien poussé tous les fichiers sur GitHub
- [ ] Le build Vercel est passé (vert)
- [ ] Tu as rafraîchi la page (vide le cache si besoin)

---

## 🎯 PROCHAINES ÉTAPES

Une fois que tout fonctionne :
1. ✅ Auth + Rôles → FAIT
2. ⏳ Créer le système de gestion du stock
3. ⏳ Créer le système de clients/revendeurs
4. ⏳ Créer le système de factures

---

## 💡 ASTUCE PRO

Tu peux créer une **branche de dev** pour tester sans casser la prod :

```bash
git checkout -b dev
# fais tes modifs
git push origin dev
```

Vercel créera automatiquement un **preview deployment** pour cette branche.
Tu peux tester avant de merger sur `main`.
