'use server'

import { redirect } from 'next/navigation'
import { setAuthCookie, deleteAuthCookie } from '@/lib/auth'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

// This function is designed to be used in a useFormState hook.
export async function login(prevState: { error: string } | null, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    await setAuthCookie()
    redirect('/admin/dashboard')
  } else {
    return { error: 'Invalid email or password. Please try again.' }
  }
}

export async function logout() {
  await deleteAuthCookie()
  redirect('/admin/login')
}
