'use server'

import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin-session'

/**
 * Checks if the user is authenticated by verifying the session cookie.
 * This function must be called from a Server Component or a Server Action.
 * @returns {Promise<boolean>} A promise that resolves to true if authenticated, false otherwise.
 */
export async function checkAuth(): Promise<boolean> {
  return cookies().has(COOKIE_NAME)
}

/**
 * Sets the session cookie to log the user in.
 * This function must be called from a Server Action.
 */
export async function setAuthCookie(): Promise<void> {
  cookies().set(COOKIE_NAME, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  })
}

/**
 * Deletes the session cookie to log the user out.
 * This function must be called from a Server Action.
 */
export async function deleteAuthCookie(): Promise<void> {
  cookies().delete(COOKIE_NAME)
}
