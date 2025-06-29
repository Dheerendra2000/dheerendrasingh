'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import LoginForm from './login-form'
import { Loader2 } from 'lucide-react'


function LoginPageInternal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null) // null: checking, false: not logged in, true: logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
        const from = searchParams.get('from') || '/admin/dashboard'
        router.replace(from)
      } else {
        setIsLoggedIn(false)
      }
    })
    return () => unsubscribe()
  }, [router, searchParams])

  if (isLoggedIn === null || isLoggedIn === true) {
    // Show a loader while checking or redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  // isLoggedIn is false, so show the login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <LoginForm />
    </div>
  )
}


export default function AdminLoginPage() {
  // Suspense is required for useSearchParams in child component
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    }>
      <LoginPageInternal />
    </Suspense>
  )
}
