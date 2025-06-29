import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin-session'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(COOKIE_NAME)
  const { pathname } = request.nextUrl

  // If a logged-in user tries to access the login page, redirect them to the dashboard.
  if (sessionCookie && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // If a non-logged-in user tries to access any admin page (except login), redirect them to the login page.
  if (!sessionCookie && pathname.startsWith('/admin/dashboard')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/admin/login'],
}
