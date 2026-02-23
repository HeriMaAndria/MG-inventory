# 📊 GRAPHIQUES + PAGE REVENDEURS

## ✅ CE QUI A ÉTÉ CRÉÉ

### **1. Graphiques Dashboard (Recharts)**

**Composants :**
- `RevenueChart.tsx` - Graphique ligne évolution CA
- `TopProductsChart.tsx` - Graphique barres top produits

**Dashboard gérant mis à jour :**
- `app/gerant/page.tsx` - Avec 2 graphiques intégrés

### **2. Page Revendeurs**

**Service :**
- `mockRevendeurService.ts` - CRUD + stats revendeurs

**Page :**
- `app/gerant/revendeurs/page.tsx` - Gestion complète

---

## 📦 INSTALLATION

### **ÉTAPE 1 : Installer Recharts**

```bash
npm install recharts
```

### **ÉTAPE 2 : Copier les fichiers**

```bash
# Composants charts
cp components/charts/RevenueChart.tsx ton-projet/components/charts/
cp components/charts/TopProductsChart.tsx ton-projet/components/charts/

# Service revendeurs
cp lib/services/implementations/mockRevendeurService.ts ton-projet/lib/services/implementations/

# Pages
cp app/gerant/page.tsx ton-projet/app/gerant/
cp app/gerant/revendeurs/page.tsx ton-projet/app/gerant/revendeurs/
```

### **ÉTAPE 3 : Mettre à jour Sidebar**

Ajouter le lien "Revendeurs" dans le menu Gérant :

```typescript
// components/layout/Sidebar.tsx
const menuItems: MenuItem[] = [
  // ... autres items
  
  // Gérant
  { icon: '📊', label: 'Dashboard', href: '/gerant', roles: ['gerant'] },
  { icon: '📦', label: 'Stock', href: '/gerant/stock', roles: ['gerant'] },
  { icon: '🛒', label: 'Commandes', href: '/gerant/commandes', roles: ['gerant'] },
  { icon: '🧾', label: 'Factures', href: '/gerant/factures', roles: ['gerant'] },
  { icon: '👥', label: 'Revendeurs', href: '/gerant/revendeurs', roles: ['gerant'] }, // ← AJOUTER
]
```

### **ÉTAPE 4 : Git**

```bash
git add .
git commit -m "Add charts (recharts) + revendeurs page"
git push origin no-supabase
```

---

## 🎨 FONCTIONNALITÉS

### **Dashboard Gérant**

**Graphiques :**
- 📈 **Évolution CA** - Courbe sur 6 mois
- 🏆 **Top Produits** - Barres des 5 meilleurs produits

**Carte "Revendeurs" cliquable** → `/gerant/revendeurs`

### **Page Revendeurs**

**Stats globales :**
- Total revendeurs
- Actifs / Inactifs
- CA total combiné

**Pour chaque revendeur :**
- Infos (nom, email, téléphone, adresse)
- Badge statut (Actif/Inactif)
- Stats individuelles :
  - Nombre clients
  - Nombre commandes
  - CA total
  - Commandes en attente
- Actions :
  - ✅/🔒 Activer/Désactiver
  - 📊 Historique (à implémenter)

---

## 📊 DONNÉES GRAPHIQUES

### **Actuellement : Mock data**

```typescript
// Données mockées dans le dashboard
const revenueData = [
  { month: 'Jan', revenue: 2400000 },
  { month: 'Fév', revenue: 2800000 },
  // ...
]
```

### **En production : Vraies données**

```typescript
// Calculer depuis les vraies commandes
const revenueData = await calculateMonthlyRevenue()
const topProducts = await getTopSellingProducts()
```

---

## 🎯 PERSONNALISATION

### **Couleurs graphiques**

```typescript
// RevenueChart.tsx
<Line stroke="#FDB022" />  // Jaune accent

// TopProductsChart.tsx
<Bar fill="#FDB022" />     // Jaune accent
```

### **Période graphiques**

```typescript
// Changer de 6 mois → 12 mois
const revenueData = getLast12Months()
```

### **Top produits**

```typescript
// Top 5 → Top 10
const topProductsData = getTopProducts(10)
```

---

## ✅ RÉSULTAT

**Dashboard Gérant :**
- ✅ 2 graphiques interactifs
- ✅ Tooltip au survol
- ✅ Responsive
- ✅ Thème dark cohérent

**Page Revendeurs :**
- ✅ Liste complète avec stats
- ✅ Activer/Désactiver
- ✅ Stats individuelles temps réel
- ✅ Badge statut visuel

---

## 🚀 PROCHAINES AMÉLIORATIONS

### **Dashboard**
- Ajouter graphique pie chart (répartition catégories)
- Filtre par période (7j, 30j, 6m, 1an)
- Export données en Excel

### **Revendeurs**
- Page détails revendeur (`/gerant/revendeurs/[id]`)
- Historique complet commandes
- Graphique évolution CA par revendeur
- Ajouter nouveau revendeur (formulaire)

---

**Les graphiques et la page revendeurs sont prêts !** 📊👥✨
