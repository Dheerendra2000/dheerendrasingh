import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from './login-form'

const COOKIE_NAME = 'admin-session'

export default function AdminLoginPage() {
  const cookieStore = cookies()
  const hasCookie = cookieStore.has(COOKIE_NAME)

  if (hasCookie) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <LoginForm />
    </div>
  )
}
