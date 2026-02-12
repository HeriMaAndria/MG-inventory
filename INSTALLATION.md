# 🚨 PROBLÈME : Tu mélanges Next.js et React Vite !

## ❌ SUPPRIMER TOUT LE CODE NEXT.JS

Supprime ces fichiers/dossiers :
```
app/
lib/
middleware.ts
next.config.js
postcss.config.js
tailwind.config.js
tsconfig.json
package.json (l'ancien)
```

## ✅ NOUVEAU PROJET REACT VITE

### 1. Copie ces fichiers à la racine :
- `index.html`
- `package.json`
- `vite.config.js`
- `.gitignore`
- `.env.example`
- `src/` (dossier complet)

### 2. Structure finale :
```
MG-inventory/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── .env.example
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    ├── hooks/
    ├── pages/
    ├── services/
    └── styles/
```

### 3. Installer les dépendances :
```bash
npm install
```

### 4. Créer le fichier .env :
```bash
cp .env.example .env
# Puis édite .env avec tes vraies clés Supabase
```

### 5. Lancer le dev :
```bash
npm run dev
```

### 6. Build pour production (Vercel) :
```bash
npm run build
```

## 🎯 Configuration Vercel

Dans les settings Vercel :
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Environment Variables :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
