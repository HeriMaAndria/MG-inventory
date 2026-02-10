# 🧠 COMPRENDRE CHAQUE LIGNE - Guide d'apprentissage

Ce document explique **comment fonctionne chaque partie du code**.

---

## 📁 STRUCTURE DU PROJET

```
MG-inventory/
├── app/                    # Dossier principal Next.js 15 (App Router)
│   ├── layout.tsx         # Layout racine (enveloppe toutes les pages)
│   ├── page.tsx           # Page d'accueil (/)
│   ├── globals.css        # Styles globaux
│   ├── login/             
│   │   └── page.tsx       # Page de connexion (/login)
│   ├── admin/
│   │   └── page.tsx       # Dashboard admin (/admin)
│   ├── gerant/
│   │   └── page.tsx       # Dashboard gérant (/gerant)
│   └── revendeur/
│       └── page.tsx       # Dashboard revendeur (/revendeur)
├── lib/                   # Bibliothèques et utilitaires
│   └── supabase/
│       ├── client.ts      # Client Supabase pour le navigateur
│       └── server.ts      # Client Supabase pour le serveur
├── middleware.ts          # Protège les routes (s'exécute avant chaque requête)
├── package.json           # Liste des dépendances npm
└── next.config.js         # Configuration Next.js
```

---

## 1️⃣ COMPRENDRE `package.json`

```json
{
  "name": "mg-inventory",           // Nom du projet
  "version": "0.1.0",                // Version
  "private": true,                   // Ne sera pas publié sur npm
  "scripts": {
    "dev": "next dev",               // Lance le serveur de dev (localhost:3000)
    "build": "next build",           // Compile pour la production
    "start": "next start",           // Lance la version compilée
    "lint": "next lint"              // Vérifie les erreurs de code
  },
  "dependencies": {                  // Packages nécessaires en production
    "react": "^18.3.1",              // Bibliothèque React
    "next": "^15.1.0",               // Framework Next.js
    "@supabase/supabase-js": "^2.39.0",  // Client Supabase (auth + database)
    "@supabase/ssr": "^0.1.0"        // Gestion des cookies pour Supabase
  },
  "devDependencies": {               // Packages pour le développement uniquement
    "typescript": "^5.3.3",          // Langage TypeScript
    "tailwindcss": "^3.4.0"          // Framework CSS
  }
}
```

### 🧠 À RETENIR
- `dependencies` = nécessaire pour faire tourner l'app
- `devDependencies` = outils pour développer

---

## 2️⃣ COMPRENDRE `app/layout.tsx`

```tsx
import type { Metadata } from 'next'     // Type TypeScript pour les métadonnées
import './globals.css'                   // Importe les styles globaux

// Métadonnées du site (apparaît dans l'onglet du navigateur)
export const metadata: Metadata = {
  title: 'MG Inventory - Gestion Commerciale',
  description: 'Système de gestion pour matériaux de construction',
}

// Layout racine : enveloppe TOUTES les pages
export default function RootLayout({
  children,                              // "children" = contenu de la page actuelle
}: {
  children: React.ReactNode              // Type : n'importe quel élément React
}) {
  return (
    <html lang="fr">                     {/* Langue du site */}
      <body className="min-h-screen bg-gray-50">  {/* Classes Tailwind */}
        {children}                       {/* Ici s'affiche le contenu de la page */}
      </body>
    </html>
  )
}
```

### 🧠 À RETENIR
- Le layout enveloppe **toutes les pages**
- `{children}` est remplacé par le contenu de chaque page
- Si tu ajoutes un élément ici, il sera sur **toutes les pages**

### 💡 EXEMPLE
Si tu veux un header partout :
```tsx
<body>
  <header>Mon Header</header>
  {children}
</body>
```

---

## 3️⃣ COMPRENDRE `lib/supabase/client.ts`

```tsx
import { createBrowserClient } from '@supabase/ssr'

// Cette fonction crée un client Supabase pour le NAVIGATEUR
export function createClient() {
  
  // Récupère les variables d'environnement
  // process.env = objet contenant les variables d'environnement
  // Le "!" dit à TypeScript "je sais qu'elle existe, fais-moi confiance"
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Vérifie qu'elles sont bien définies
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables Supabase manquantes')
  }

  // Crée et retourne l'instance du client
  return createBrowserClient(supabaseUrl, supabaseKey)
}
```

### 🧠 À RETENIR

#### Pourquoi deux clients (browser vs server) ?
- **Browser** : utilisé dans les composants React ('use client')
- **Server** : utilisé dans les Server Components et API Routes

#### Pourquoi `NEXT_PUBLIC_` ?
- Les variables avec ce préfixe sont **accessibles côté navigateur**
- Celles sans ce préfixe sont **secrètes** (serveur uniquement)

#### C'est sécurisé ?
- Oui ! La clé `anon` est conçue pour être publique
- Elle a des restrictions (Row Level Security)
- La vraie sécurité est dans Supabase, pas dans le client

---

## 4️⃣ COMPRENDRE `middleware.ts`

Le middleware est le **gardien** de ton app. Il s'exécute **avant chaque requête**.

```tsx
export async function middleware(request: NextRequest) {
  
  // 1. Crée une réponse par défaut (laisser passer)
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 2. Crée un client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Gestion des cookies (session)
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Met à jour les cookies dans la requête ET la réponse
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        // ... (idem pour remove)
      },
    }
  )

  // 3. Récupère l'utilisateur actuel
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Récupère le chemin demandé
  const { pathname } = request.nextUrl

  // 5. LOGIQUE DE SÉCURITÉ
  
  // Si pas connecté ET essaie d'accéder à une route protégée
  if (!user && (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/gerant') ||
    pathname.startsWith('/revendeur')
  )) {
    // Redirige vers /login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si connecté ET sur la page login
  if (user && pathname === '/login') {
    // Récupère son rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Redirige vers son dashboard
    if (profile) {
      return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
    }
  }

  // Sinon, laisse passer
  return response
}
```

### 🧠 À RETENIR

#### Ordre d'exécution
1. User demande `/admin`
2. **Middleware s'exécute**
3. Vérifie la session
4. Décide si on laisse passer ou redirige
5. La page `/admin` s'affiche (ou pas)

#### Pourquoi c'est important ?
Sans middleware, n'importe qui pourrait taper `/admin` dans l'URL et voir le dashboard.

---

## 5️⃣ COMPRENDRE `app/login/page.tsx`

```tsx
'use client'  // Ce composant s'exécute côté navigateur

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()              // Pour naviguer entre les pages
  const supabase = createClient()         // Client Supabase

  // États React (données qui peuvent changer)
  const [email, setEmail] = useState('')             // Email du formulaire
  const [password, setPassword] = useState('')       // Mot de passe
  const [loading, setLoading] = useState(false)      // État de chargement
  const [error, setError] = useState('')             // Message d'erreur

  // Fonction appelée quand on soumet le formulaire
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()    // Empêche le rechargement de la page
    setError('')          // Reset les erreurs précédentes
    setLoading(true)      // Active le loader

    try {
      // 1. Tente la connexion
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError  // Si erreur, on saute au catch

      // 2. Récupère le rôle
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single()

      if (profileError) throw profileError

      // 3. Redirige vers le bon dashboard
      router.push(`/${profile.role}`)

    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)  // Désactive le loader (dans tous les cas)
    }
  }

  return (
    // ... JSX (structure HTML avec React)
  )
}
```

### 🧠 À RETENIR

#### `useState` = Mémoire du composant
```tsx
const [email, setEmail] = useState('')
```
- `email` = valeur actuelle
- `setEmail` = fonction pour changer la valeur
- `''` = valeur par défaut

Quand tu fais `setEmail('test@test.com')` :
→ React **re-render** le composant avec la nouvelle valeur

#### `async/await` = Attendre une réponse
```tsx
const result = await supabase.auth.signInWithPassword(...)
```
- `await` = attends que l'opération se termine
- Nécessite `async` sur la fonction

#### `try/catch` = Gérer les erreurs
```tsx
try {
  // Code qui peut échouer
} catch (err) {
  // Que faire si ça échoue
} finally {
  // Toujours exécuté
}
```

---

## 6️⃣ COMPRENDRE `app/admin/page.tsx`

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// AUCUN 'use client' = Server Component
// S'exécute côté serveur, pas dans le navigateur

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Vérifie l'auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')  // Redirige côté serveur (avant d'envoyer la page)
  }

  // Vérifie le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/login')
  }

  // Server Action pour se déconnecter
  async function handleLogout() {
    'use server'  // Cette fonction s'exécute côté serveur
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    // ... JSX
  )
}
```

### 🧠 À RETENIR

#### Server Component vs Client Component

**Server Component** (par défaut) :
- S'exécute sur le serveur
- Peut faire des requêtes database directement
- Plus rapide (pas de JS envoyé au navigateur)
- Ne peut pas utiliser `useState`, `useEffect`, etc.

**Client Component** ('use client') :
- S'exécute dans le navigateur
- Peut utiliser les hooks React
- Nécessaire pour l'interactivité (formulaires, boutons)

#### Server Actions
```tsx
async function handleLogout() {
  'use server'
  // ...
}
```
- Fonction qui s'exécute côté serveur
- Peut être appelée depuis un `<form>` HTML
- Plus sécurisé (pas d'exposition du code)

---

## 🎯 CONCEPTS CLÉS À MAÎTRISER

### 1. Client vs Server
- **Client** = navigateur (ton téléphone/ordi)
- **Server** = Vercel (où tourne l'app)

### 2. async/await
- **sync** = bloque tout (mauvais)
- **async** = continue pendant que ça charge (bon)

### 3. useState
- Pour stocker des données qui changent
- Provoque un re-render quand ça change

### 4. Supabase
- **Auth** = gestion des utilisateurs
- **Database** = stockage des données
- **RLS** = sécurité (qui peut voir quoi)

### 5. Middleware
- S'exécute **avant** chaque page
- Protège les routes
- Vérifie les permissions

---

## ✅ TEST DE COMPRÉHENSION

Avant de continuer, tu dois pouvoir répondre à ces questions :

1. Quelle est la différence entre `client.ts` et `server.ts` ?
2. Pourquoi utilise-t-on `'use client'` sur la page de login ?
3. Que fait le middleware si un utilisateur non connecté essaie d'aller sur `/admin` ?
4. Quelle est la différence entre `useState` et une variable normale ?
5. Pourquoi les variables d'environnement ont-elles `NEXT_PUBLIC_` ?

**Si tu ne sais pas répondre**, relis les sections correspondantes.

---

## 🚀 PROCHAINE ÉTAPE

Une fois que tu as **compris** (pas juste lu) ce document :
1. Déploie le code sur Vercel
2. Teste les 3 rôles
3. Ouvre la console du navigateur (F12)
4. Regarde ce qui se passe quand tu te connectes

Puis on attaque la gestion du stock ! 🎯
