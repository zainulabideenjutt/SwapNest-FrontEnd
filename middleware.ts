import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Check if user has access token
    const isAuthenticated = request.cookies.has('access_token')

    // Define auth pages
    const authPages = ['/login', '/register']
    const isAuthPage = authPages.includes(request.nextUrl.pathname)

    // If trying to access auth pages while authenticated, redirect to home
    if (isAuthPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // If trying to access protected pages while not authenticated, redirect to login
    if (!isAuthPage && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /fonts (inside /public)
         * 4. /examples (inside /public)
         * 5. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}