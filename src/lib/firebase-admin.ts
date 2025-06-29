
import * as dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import type { App } from 'firebase-admin/app';
import path from 'path';

// This file is for server-side Firebase operations.
// It initializes the Firebase Admin SDK.

// IMPORTANT: To use this, you must set the FIREBASE_SERVICE_ACCOUNT_KEY
// environment variable in a .env file in your project's root directory.
// The value should be the stringified JSON of your service account key.
//
// Example .env file:
// FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
//
// You can get your service account key from the Firebase console:
// Project Settings > Service accounts > Generate new private key

type FirebaseAdmin = {
    app: App | null;
    db: admin.firestore.Firestore | null;
    adminAuth: admin.auth.Auth | null;
    initError: string | null;
}

function initializeFirebaseAdmin(): FirebaseAdmin {
  if (admin.apps.length > 0) {
    const app = admin.app();
    return {
        app,
        db: getFirestore(app),
        adminAuth: app.auth(),
        initError: null
    };
  }

  // Explicitly load environment variables from the project root .env file
  // This is for local development and ensures the server has credentials.
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey || serviceAccountKey.trim() === 'PASTE_YOUR_SERVICE_ACCOUNT_KEY_JSON_HERE') {
    const errorMsg = 'SETUP REQUIRED: The FIREBASE_SERVICE_ACCOUNT_KEY is missing. Please open the `.env` file in your project root and paste your service account JSON credentials into it. The server cannot connect to the database without it.';
    console.error(errorMsg);
    return { app: null, db: null, adminAuth: null, initError: errorMsg };
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return {
        app,
        db: getFirestore(app),
        adminAuth: app.auth(),
        initError: null
    };
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    const errorMsg = 'The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string. Please ensure you have copied the entire JSON object from your service account file.';
    return { app: null, db: null, adminAuth: null, initError: errorMsg };
  }
}

const { app, db, adminAuth, initError } = initializeFirebaseAdmin();
export { db, adminAuth, initError };
