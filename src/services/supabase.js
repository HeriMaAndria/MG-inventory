import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase ne sont pas définies')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Récupère l'utilisateur actuellement connecté
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Récupère le profil complet de l'utilisateur
 */
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return { user, profile }
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
export async function isAdmin() {
  try {
    const userProfile = await getCurrentUserProfile()
    return userProfile?.profile?.role === 'admin'
  } catch {
    return false
  }
}

/**
 * Récupère le profil d'un utilisateur spécifique
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Met à jour le profil utilisateur
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export default supabase
