import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * CLIENT SUPABASE CÔTÉ SERVEUR
 * 
 * Ce fichier crée une instance du client Supabase pour l'utiliser
 * dans les Server Components, Routes API, et Middleware.
 * 
 * La différence avec le client browser :
 * - Utilise les cookies pour gérer la session
 * - Plus sécurisé (cookies httpOnly)
 * - Nécessaire pour les redirections SSR
 */

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // En dev, logger l'erreur pour debugging
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ Cookie set failed (peut être normal dans certains contextes):', error)
            }
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // En dev, logger l'erreur pour debugging
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ Cookie remove failed (peut être normal dans certains contextes):', error)
            }
          }
        },
      },
    }
  )
}
