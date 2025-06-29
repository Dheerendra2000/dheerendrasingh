import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookie = request.cookies.get(COOKIE_NAME)

  // Only apply logic to admin routes to avoid running on all requests
  if (pathname.startsWith('/admin')) {
    const isProtectedAdminRoute = pathname.startsWith('/admin/dashboard')
    const isLoginPage = pathname === '/admin/login'

    // If user is on a protected route without a cookie, redirect to login
    if (isProtectedAdminRoute && !cookie) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname) // Optional: redirect back after login
      return NextResponse.redirect(loginUrl)
    }

    // If user is logged in and tries to access login page, redirect to dashboard
    if (isLoginPage && cookie) {
        const dashboardUrl = new URL('/admin/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
    }
  }

  return NextResponse.next()
}

// We can still use the matcher to avoid invoking the middleware on static assets.
export const config = {
  matcher: ['/admin/login', '/admin/dashboard/:path*'],
}
