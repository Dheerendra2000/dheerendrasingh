import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This file is for server-side Firebase operations.
// It initializes the Firebase Admin SDK.

// IMPORTANT: To use this, you must set the FIREBASE_SERVICE_ACCOUNT_KEY
// environment variable in a .env.local file.
// The value should be the stringified JSON of your service account key.
//
// Example .env.local file:
// FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
//
// You can get your service account key from the Firebase console:
// Project Settings > Service accounts > Generate new private key

function initializeFirebaseAdmin(): App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable. Please add it to your .env.local file.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string.');
  }
}

export const adminAuth = initializeFirebaseAdmin().auth();
