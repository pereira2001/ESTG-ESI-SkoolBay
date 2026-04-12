import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextAuthRequest } from 'next-auth'

const protectedRoutes = ['/dashboard', '/services/new', '/profile/edit']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export default auth((req: NextAuthRequest) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session

  const isProtected = protectedRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAdmin = adminRoutes.some((r) => nextUrl.pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => nextUrl.pathname.startsWith(r))

  const role = (session?.user as { role?: string } | undefined)?.role

  if (isAdmin && (!isLoggedIn || role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isProtected && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
