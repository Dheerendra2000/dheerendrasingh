import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin-session'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)
  const { pathname } = request.nextUrl

  const isProtectedAdminRoute = pathname.startsWith('/admin/dashboard')

  // If user is trying to access dashboard without a cookie, redirect to login
  if (!cookie && isProtectedAdminRoute) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user has a cookie and tries to access login page, redirect to dashboard
  if (cookie && pathname === '/admin/login') {
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const runtime = 'nodejs'

export const config = {
  matcher: ['/admin/login', '/admin/dashboard/:path*'],
}
