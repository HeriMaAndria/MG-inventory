import { createBrowserClient } from '@supabase/ssr'

/**
 * CLIENT SUPABASE CÔTÉ NAVIGATEUR
 * 
 * Ce fichier crée une instance du client Supabase pour l'utiliser
 * dans les composants React côté client (avec 'use client').
 * 
 * Les variables d'environnement NEXT_PUBLIC_* sont accessibles
 * dans le navigateur (c'est normal et sécurisé avec la clé anon).
 */

export function createClient() {
  // Récupère les variables d'environnement
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Vérifie qu'elles sont bien définies
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables Supabase manquantes. Vérifie .env.local ou Vercel.')
  }

  // Crée et retourne le client
  return createBrowserClient(supabaseUrl, supabaseKey)
}
