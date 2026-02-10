# ✅ CHECKLIST DE DÉPLOIEMENT

Utilise cette checklist pour ne rien oublier.

---

## 📋 PHASE 1 : CONFIGURATION SUPABASE

- [ ] Créer un compte Supabase
- [ ] Créer un nouveau projet (`mg-inventory`)
- [ ] Noter l'URL du projet
- [ ] Noter la clé `anon public`
- [ ] Créer la table `profiles` (voir SUPABASE_SETUP.md)
- [ ] Créer 3 utilisateurs de test (admin, gerant, revendeur)
- [ ] Vérifier que les 3 utilisateurs sont dans la table `profiles`

---

## 📋 PHASE 2 : PRÉPARATION DU CODE

- [ ] Télécharger tous les fichiers fournis
- [ ] Vérifier que la structure correspond au README
- [ ] Créer un fichier `.env.local` avec tes vraies valeurs (local uniquement)
- [ ] Vérifier que `.gitignore` est présent

---

## 📋 PHASE 3 : GITHUB

- [ ] Créer un nouveau repo sur GitHub (`MG-inventory`)
- [ ] Le mettre en **Private** (recommandé)
- [ ] Initialiser Git localement (`git init`)
- [ ] Ajouter les fichiers (`git add .`)
- [ ] Faire le premier commit (`git commit -m "Initial setup"`)
- [ ] Ajouter le remote (`git remote add origin ...`)
- [ ] Pousser le code (`git push -u origin main`)
- [ ] Vérifier sur GitHub que tous les fichiers sont là

---

## 📋 PHASE 4 : VERCEL

- [ ] Créer un compte Vercel (ou se connecter)
- [ ] Cliquer sur "Add New Project"
- [ ] Importer depuis GitHub
- [ ] Sélectionner le repo `MG-inventory`
- [ ] Ajouter les variables d'environnement :
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Lancer le déploiement
- [ ] Attendre que le build se termine (vert = OK)
- [ ] Copier l'URL du site

---

## 📋 PHASE 5 : TESTS

### Test 1 : Page d'accueil
- [ ] Aller sur `ton-site.vercel.app`
- [ ] Vérifier que la page s'affiche
- [ ] Pas d'erreur dans la console (F12)

### Test 2 : Connexion Admin
- [ ] Aller sur `/login`
- [ ] Se connecter avec `admin@mg.com` / `password123`
- [ ] Vérifier la redirection vers `/admin`
- [ ] Vérifier que le nom s'affiche
- [ ] Vérifier le bouton "Déconnexion"

### Test 3 : Connexion Gérant
- [ ] Se déconnecter
- [ ] Se connecter avec `gerant@mg.com` / `password123`
- [ ] Vérifier la redirection vers `/gerant`
- [ ] Vérifier le contenu du dashboard

### Test 4 : Connexion Revendeur
- [ ] Se déconnecter
- [ ] Se connecter avec `revendeur@mg.com` / `password123`
- [ ] Vérifier la redirection vers `/revendeur`
- [ ] Vérifier le contenu du dashboard

### Test 5 : Protection des routes
- [ ] Se déconnecter
- [ ] Essayer d'aller sur `/admin` → doit rediriger vers `/login`
- [ ] Essayer d'aller sur `/gerant` → doit rediriger vers `/login`
- [ ] Se connecter en tant que revendeur
- [ ] Essayer d'aller sur `/admin` → doit rester sur `/revendeur` (middleware)

---

## 🐛 EN CAS D'ERREUR

### Build failed sur Vercel
1. Regarde les logs (clique sur le build raté)
2. Cherche le message d'erreur
3. Souvent : fichier manquant ou erreur de syntaxe
4. Corrige localement, commit, push

### Page blanche
1. Ouvre la console (F12)
2. Regarde les erreurs
3. Souvent : variables d'environnement manquantes
4. Vérifie dans Vercel → Settings → Environment Variables
5. Redéploie après avoir ajouté les variables

### Erreur de connexion
1. Vérifie que les users existent dans Supabase
2. Vérifie que la table `profiles` existe
3. Vérifie que les rôles sont bien assignés
4. Essaie de te connecter directement sur Supabase Auth

### Middleware ne redirige pas
1. Vérifie que `middleware.ts` est à la racine
2. Vérifie qu'il n'y a pas d'erreur de syntaxe
3. Vérifie les logs Vercel (Real-time Logs)

---

## ✅ VALIDATION FINALE

Si tu as coché toutes les cases et que les tests passent :

**🎉 FÉLICITATIONS !**

Tu as :
- ✅ Configuré Supabase
- ✅ Déployé sur Vercel
- ✅ Authentification fonctionnelle
- ✅ Système de rôles opérationnel
- ✅ Protection des routes active

**Tu es prêt pour la prochaine étape : Gestion du stock**

---

## 📸 SCREENSHOT À FAIRE

Pour garder une trace :
1. Dashboard Admin connecté
2. Dashboard Gérant connecté
3. Dashboard Revendeur connecté
4. Page de login
5. Console Vercel (build success)

---

## 🎯 PROCHAINE ÉTAPE

Une fois tout validé, reviens me voir avec :
- ✅ "Tout fonctionne, je passe à la suite"
- ❌ "J'ai un problème à l'étape X" + capture d'écran de l'erreur
