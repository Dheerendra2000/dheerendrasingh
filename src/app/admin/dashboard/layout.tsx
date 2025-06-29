import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { verifySessionCookie } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await verifySessionCookie()
  const pathname = headers().get('x-next-pathname') || '/admin/dashboard'

  if (!session) {
    // Build a URL that preserves the original path the user tried to access.
    const loginUrl = new URL('/admin/login', 'http://localhost:3000') // Base URL is a placeholder.
    loginUrl.searchParams.set('from', pathname)
    
    // Redirect to the login page.
    redirect(loginUrl.toString())
  }

  return <>{children}</>
}
