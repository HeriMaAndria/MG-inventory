/**
 * AUTH SYSTEM SANS SUPABASE
 * Système d'authentification simple en localStorage
 */

// Utilisateurs hardcodés (à remplacer par Supabase plus tard)
const MOCK_USERS = [
  { id: 'admin-1', email: 'admin@mg.com', password: 'password123', role: 'admin' as const, name: 'Admin Test' },
  { id: 'gerant-1', email: 'gerant@mg.com', password: 'password123', role: 'gerant' as const, name: 'Gérant Test' },
  { id: 'revendeur-1', email: 'revendeur@mg.com', password: 'password123', role: 'revendeur' as const, name: 'Revendeur Test' },
]

export interface User {
  id: string
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

  const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password)

  if (!foundUser) {
    return { user: null, error: 'Email ou mot de passe incorrect' }
  }

  // Créer l'objet User (sans le password)
  const user: User = {
    id: foundUser.id,
    email: foundUser.email,
    role: foundUser.role,
    name: foundUser.name,
  }

  // Stocker dans localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user))
  }

  return { user, error: null }
}

/**
 * Déconnexion
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}

/**
 * Obtenir l'utilisateur actuel
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem('user')
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Vérifier si l'utilisateur est connecté
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
