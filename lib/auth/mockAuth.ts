/**
 * AUTH SYSTEM SANS SUPABASE
 * Système d'authentification simple en localStorage
 */

// Utilisateurs hardcodés (à remplacer par Supabase plus tard)
const MOCK_USERS = [
  { email: 'admin@mg.com', password: 'password123', role: 'admin', name: 'Admin Test' },
  { email: 'gerant@mg.com', password: 'password123', role: 'gerant', name: 'Gérant Test' },
  { email: 'revendeur@mg.com', password: 'password123', role: 'revendeur', name: 'Revendeur Test' },
]

export interface User {
  email: string
  role: 'admin' | 'gerant' | 'revendeur'
  name: string
}

/**
 * Connexion
 */
export async function login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  // Simule un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500))

  const user = MOCK_USERS.find(u => u.email === email && u.password === password)

  if (!user) {
    return { user: null, error: 'Email ou mot de passe incorrect' }
  }

  const userData: User = {
    email: user.email,
    role: user.role as any,
    name: user.name,
  }

  // Stocke dans localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  return { user: userData, error: null }
}

/**
 * Déconnexion
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user')
  }
}

/**
 * Récupère l'utilisateur actuel
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('auth_user')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Vérifie si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
