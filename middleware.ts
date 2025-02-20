import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('access_token')
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}