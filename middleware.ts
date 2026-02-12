import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * MIDDLEWARE SIMPLIFIÉ POUR DEBUG
 * 
 * Version allégée qui log les erreurs et gère les cas limites
 */

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Vérifie que les variables d'environnement existent
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variables Supabase manquantes')
      // Laisse passer sans bloquer
      return response
    }

    // Crée le client Supabase
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
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

    // Récupère l'utilisateur actuel
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('❌ Erreur auth:', authError.message)
    }

    const { pathname } = request.nextUrl

    // Protection des routes - version simplifiée
    const protectedRoutes = ['/admin', '/gerant', '/revendeur']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Si pas connecté et route protégée → redirige vers login
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si connecté et sur /login → redirige vers dashboard
    if (user && pathname === '/login') {
      // Essaie de récupérer le rôle, mais ne crash pas si ça échoue
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('⚠️ Erreur récupération profil:', profileError.message)
          // Redirige vers admin par défaut si erreur
          return NextResponse.redirect(new URL('/admin', request.url))
        }

        if (profile && profile.role) {
          return NextResponse.redirect(new URL(`/${profile.role}`, request.url))
        }
      } catch (err) {
        console.error('⚠️ Erreur dans récupération profile:', err)
        // Continue sans bloquer
      }
    }

    return response

  } catch (error) {
    // En cas d'erreur, log et laisse passer
    console.error('❌ Erreur middleware:', error)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
