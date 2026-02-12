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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // En build time ou si les variables manquent, utiliser des placeholders
  // Les vraies valeurs seront injectées par Vercel au runtime
  const finalUrl = supabaseUrl || 'https://placeholder.supabase.co'
  const finalKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

  // Avertir en dev/runtime si les vraies valeurs manquent
  if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
    console.error('⚠️ ERREUR CRITIQUE: Variables Supabase non configurées!')
    console.error('→ Configure NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel')
    console.error('→ Ou crée un fichier .env.local en local')
  }

  // Validation du format URL (uniquement si pas placeholder)
  if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co') {
    try {
      new URL(supabaseUrl)
    } catch {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL doit être une URL valide (ex: https://xxx.supabase.co)')
    }
  }

  // Crée et retourne le client
  return createBrowserClient(finalUrl, finalKey)
}
