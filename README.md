# 🧱 MG INVENTORY - PROJET COMPLET

## 📦 Système de gestion commerciale pour matériaux de construction

---

## 🎯 CARACTÉRISTIQUES

- ✅ **Architecture professionnelle** (séparation des couches)
- ✅ **Auth locale** (mockAuth avec localStorage)
- ✅ **Services abstraits** (prêt pour Supabase)
- ✅ **Design sombre** (noir/gris + accent jaune)
- ✅ **3 rôles** : Admin, Gérant, Revendeur
- ✅ **CRUD produits** fonctionnel
- ✅ **TypeScript** strict
- ✅ **Next.js 15** App Router

---

## 🚀 INSTALLATION

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Ouvrir http://localhost:3000
```

---

## 👤 COMPTES DE TEST

```
Admin :     admin@mg.com / password123
Gérant :    gerant@mg.com / password123
Revendeur : revendeur@mg.com / password123
```

---

## 📁 STRUCTURE

```
app/
├── page.tsx                    # Page d'accueil
├── login/page.tsx              # Connexion
├── register/page.tsx           # Inscription
├── admin/page.tsx              # Dashboard admin
├── gerant/
│   ├── page.tsx               # Dashboard gérant
│   └── stock/page.tsx         # Gestion du stock
└── revendeur/page.tsx         # Dashboard revendeur

components/
├── ui/                        # Composants de base
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Modal.tsx
├── forms/
│   └── ProductForm.tsx        # Formulaire produit
├── tables/
│   └── ProductTable.tsx       # Tableau produits
├── dashboard/
│   └── StatCard.tsx           # Carte statistique
└── ProtectedPage.tsx          # Protection routes

lib/
├── types/
│   └── models.ts              # Tous les types
├── services/
│   ├── contracts/             # Interfaces services
│   ├── implementations/       # Implémentations mock
│   └── index.ts              # Point d'entrée
└── auth/
    └── mockAuth.ts            # Auth localStorage
```

---

## 🔄 MIGRATION VERS SUPABASE

Quand tu seras prêt :

1. Crée `lib/services/implementations/supabaseProductService.ts`
2. Change 1 ligne dans `lib/services/index.ts` :
   ```typescript
   export const productService = supabaseProductService
   ```
3. C'est tout ! Aucune page à modifier.

---

## ✅ FONCTIONNALITÉS ACTUELLES

### **Authentification**
- [x] Login / Logout
- [x] Protection des routes
- [x] Redirection par rôle

### **Gestion du stock (Gérant)**
- [x] Liste des produits
- [x] Ajout produit
- [x] Modification produit
- [x] Suppression produit
- [x] Recherche / Filtres
- [x] Statistiques

### **Dashboards**
- [x] Dashboard Admin
- [x] Dashboard Gérant
- [x] Dashboard Revendeur

---

## 📋 PROCHAINES ÉTAPES

- [ ] Page gestion clients
- [ ] Page création factures
- [ ] Page commandes
- [ ] Génération PDF
- [ ] Graphiques avancés
- [ ] Migration Supabase

---

## 🛠️ TECHNOLOGIES

- **Framework :** Next.js 15
- **UI :** React 19, Tailwind CSS
- **Types :** TypeScript
- **Auth :** localStorage (mockAuth)
- **Data :** Services abstraits (mock → Supabase)

---

## 📖 DOCUMENTATION

- `ARCHITECTURE.md` - Détails de l'architecture
- Commentaires dans le code pour chaque fichier

---

## 🎨 DESIGN SYSTEM

**Couleurs :**
- Fond : `#0a0a0a` (noir profond)
- Surface : `#1a1a1a` (gris foncé)
- Accent : `#fbbf24` (jaune)
- Texte : `#f5f5f5` (blanc cassé)

**Composants :**
- Effet glass sur les containers
- Animations fluides
- Responsive mobile-first

---

**Projet créé avec ❤️ pour MG Inventory** 🧱
