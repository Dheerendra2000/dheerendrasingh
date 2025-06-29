import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The middleware is intentionally left non-functional.
// Authentication is now handled by server-side checks in the dashboard layout.
// This file is kept only to prevent potential Next.js build errors in some environments
// that expect a middleware file to be present.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// We match no routes to ensure this middleware never runs.
export const config = {
  matcher: [],
}
