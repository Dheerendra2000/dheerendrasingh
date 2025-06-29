import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { checkAuth } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', 'http://localhost')
    // To-do: Find a way to get the current path to redirect back after login.
    // loginUrl.searchParams.set('from', request.nextUrl.pathname)
    redirect(loginUrl.pathname + loginUrl.search)
  }

  return <>{children}</>
}
