import { redirect } from 'next/navigation'
import { verifySessionCookie } from '@/lib/auth'
import LoginForm from './login-form'
import { Suspense } from 'react'

// This wrapper component allows the LoginForm to be a Client Component
// that uses searchParams, while the page itself remains a Server Component.
function LoginPageContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Suspense fallback={<div className="w-full max-w-sm mx-4 h-96" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}


export default async function AdminLoginPage() {
  // If the user is already logged in, redirect them to the dashboard.
  const session = await verifySessionCookie()
  if (session) {
    redirect('/admin/dashboard')
  }

  return <LoginPageContent />
}
