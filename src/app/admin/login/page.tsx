import LoginForm from './login-form'

// The middleware now handles redirecting logged-in users away from this page.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <LoginForm />
    </div>
  )
}
