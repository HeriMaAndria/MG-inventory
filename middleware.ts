import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * MIDDLEWARE - VERSION ROBUSTE
 * 
 * Gère les erreurs sans crash
 */

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Vérifie les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables Supabase manquantes')
      return response
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('⚠️ Erreur auth:', authError.message)
    }

    const { pathname } = request.nextUrl

    // Routes protégées
    const protectedRoutes = ['/admin', '/gerant', '/revendeur']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Si pas connecté et route protégée
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si connecté et sur /login, redirige vers dashboard
    if (user && pathname === '/login') {
      // NE PAS lire la table profiles ici pour éviter l'erreur
      // On redirige vers /admin par défaut, la page se chargera de vérifier le rôle
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response

  } catch (error) {
    console.error('❌ Erreur middleware:', error)
    // En cas d'erreur, laisse passer sans bloquer
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
