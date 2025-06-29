'use server'

import { redirect } from 'next/navigation'
import { deleteAuthCookie } from '@/lib/auth'

// The login function is now handled on the client-side using Firebase authentication.
// The `login` server action is no longer needed.

export async function logout() {
  await deleteAuthCookie()
  redirect('/admin/login')
}
