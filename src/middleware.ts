import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin-session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasCookie = request.cookies.has(COOKIE_NAME)

  // If trying to access login page while already logged in, redirect to dashboard
  if (hasCookie && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // If trying to access a protected admin route without being logged in, redirect to login
  if (!hasCookie && pathname.startsWith('/admin/dashboard')) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // This matcher ensures the middleware runs on all admin routes
  matcher: ['/admin/:path*'],
}
