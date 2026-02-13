import { NextResponse, type NextRequest } from 'next/server'

/**
 * MIDDLEWARE SANS SUPABASE
 * Version simplifiée qui check juste localStorage via cookie
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes protégées
  const protectedRoutes = ['/admin', '/gerant', '/revendeur']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Si route protégée, on laisse la page gérer (elle vérifiera localStorage)
  // Le middleware ne peut pas lire localStorage, donc on délègue aux pages

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
