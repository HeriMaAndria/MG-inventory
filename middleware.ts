import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * MIDDLEWARE - GARDIEN DES ROUTES
 * 
 * Ce fichier s'exécute AVANT chaque requête.
 * Il vérifie si l'utilisateur est connecté et a les droits d'accès.
 * 
 * FONCTIONNEMENT :
 * 1. Utilisateur demande /admin/dashboard
 * 2. Middleware vérifie la session
 * 3. Si pas connecté → redirige vers /login
 * 4. Si connecté mais pas admin → redirige vers son dashboard
 * 5. Sinon → laisse passer
 */

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Crée un client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Récupère la session actuelle
  const { data: { user } } = await supabase.auth.getUser()

  // Route demandée
  const { pathname } = request.nextUrl

  // Si pas connecté et essaie d'accéder à une route protégée
  if (!user && pathname.startsWith('/admin') || 
      !user && pathname.startsWith('/gerant') ||
      !user && pathname.startsWith('/revendeur')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si connecté et sur la page login, redirige vers son dashboard
  if (user && pathname === '/login') {
    // Récupère le rôle depuis la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
    }
  }

  return response
}

// Configure quelles routes le middleware doit vérifier
export const config = {
  matcher: [
    /*
     * Vérifie toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
