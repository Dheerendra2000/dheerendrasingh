'use server'

import { cookies } from 'next/headers'
import { adminAuth } from './firebase-admin'
import type { DecodedIdToken } from 'firebase-admin/auth'

const COOKIE_NAME = 'admin-session'

/**
 * Creates a session cookie after verifying the provided ID token.
 * @param idToken The Firebase ID token from the client.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function createSessionCookie(idToken: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    // Create the session cookie. This will also verify the ID token.
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    cookies().set(COOKIE_NAME, sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error creating session cookie:', error)
    return { success: false, message: error.message }
  }
}

/**
 * Verifies the session cookie from the request.
 * @returns {Promise<DecodedIdToken | null>} The decoded token if the cookie is valid, otherwise null.
 */
export async function verifySessionCookie(): Promise<DecodedIdToken | null> {
  const sessionCookie = cookies().get(COOKIE_NAME)?.value
  if (!sessionCookie) {
    return null
  }

  try {
    // Set checkRevoked to true to ensure the user's session is still valid.
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decodedToken
  } catch (error) {
    // Session cookie is invalid or revoked.
    // Clear the invalid cookie.
    cookies().delete(COOKIE_NAME)
    return null
  }
}

/**
 * Revokes the user's refresh tokens and deletes the session cookie.
 */
export async function revokeSessionCookie(): Promise<void> {
  const sessionCookie = cookies().get(COOKIE_NAME)?.value
  cookies().delete(COOKIE_NAME)

  if (sessionCookie) {
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie)
      await adminAuth.revokeRefreshTokens(decodedToken.sub)
    } catch (error) {
      // Ignore errors if the cookie is already invalid.
    }
  }
}
