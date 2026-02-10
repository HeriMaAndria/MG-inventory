# 📋 Générateur de Factures Professionnel v2.0

## 🎯 Améliorations majeures

### ✅ Corrections effectuées
- **Sidebar visible** sur create.html et depot.html (par défaut sur desktop)
- **Pages de gestion** : Clients et Stock complètes
- **Ajouts rapides** : Modales pour ajouter clients/stock depuis create.html
- **Aperçu visuel** : Cartes de preview des factures récentes sur index.html
- **Livraison éditable** : Prix ET quantité modifiables manuellement
- **Navigation** : Barre de navigation cohérente sur toutes les pages

### 🗄️ Structure du projet
```
facture-pro-v2/
├── index.html          # Tableau de bord avec aperçu visuel
├── create.html         # Création/modification (sidebar + ajouts rapides)
├── depot.html          # Aperçu PDF (sidebar + format A4 fixe)
├── clients.html        # Gestion des clients
├── stock.html          # Gestion du stock
├── js/
│   ├── database.js     # Base de données localStorage
│   ├── index.js        # Logique tableau de bord
│   ├── create.js       # Logique création
│   ├── depot.js        # Logique aperçu
│   ├── clients.js      # Logique clients
│   └── stock.js        # Logique stock
└── css/
    ├── styles.css      # Styles globaux + navbar
    ├── index.css       # Styles aperçu visuel factures
    ├── create.css      # Styles création + sidebar
    └── depot.css       # Styles aperçu + sidebar

```

## ✨ Fonctionnalités

### 📊 Tableau de bord (index.html)
- Statistiques en temps réel
- **Aperçu visuel** des 6 dernières factures (cartes cliquables)
- Historique complet avec recherche
- Export des données

### ✏️ Création (create.html)
- **Sidebar visible** avec liste des factures
- **Ajout rapide** de clients et articles stock via modales
- Autocomplétion des clients
- **Taille optionnelle** (= 1 si vide)
- **Livraison éditable** : prix unitaire ET quantité modifiables
- Calculs automatiques

### 👁️ Aperçu (depot.html)
- **Sidebar visible** avec liste des factures
- Format A4 fixe (non-responsive)
- Téléchargement PDF haute qualité
- Impression directe

### 👥 Clients (clients.html)
- Liste complète des clients
- Ajout/modification/suppression
- Recherche
- Historique des achats

### 📦 Stock (stock.html)
- Liste des articles
- Gestion prix/quantités
- Recherche

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur
2. **Sidebar** : Visible par défaut sur desktop, bouton pour ouvrir sur mobile
3. **Ajout rapide** : Boutons dans create.html pour ajouter clients/stock
4. **Livraison** : Cocher la case, puis modifier prix ET quantité manuellement

## 💡 Notes importantes

- **Sidebar** : Visible automatiquement sur écrans > 1024px
- **Taille** : Optionnelle dans les articles (valeur = 1 si vide)
- **Livraison** : Quantité maintenant éditable manuellement
- **Aperçu factures** : Format visuel sur le tableau de bord
- **Stockage** : localStorage du navigateur

## 🎨 Navigation

Barre de navigation présente sur toutes les pages :
- Tableau de bord
- Nouvelle facture
- Aperçu factures
- Clients
- Stock

---
**Version 2.0** - Système complet avec sidebar, gestion clients/stock et aperçu visuel
