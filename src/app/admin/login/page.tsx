import { redirect } from 'next/navigation'
import { checkAuth } from '@/lib/auth'
import LoginForm from './login-form'

export default async function AdminLoginPage() {
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <LoginForm />
    </div>
  )
}
