'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const COOKIE_NAME = 'admin-session'

// This function is designed to be used in a useFormState hook.
export async function login(prevState: { error: string } | null, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies().set(COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    })
    redirect('/admin/dashboard')
  } else {
    return { error: 'Invalid email or password. Please try again.' }
  }
}

export async function logout() {
  cookies().delete(COOKIE_NAME)
  redirect('/admin/login')
}
