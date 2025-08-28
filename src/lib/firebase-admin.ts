
import * as dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import type { App } from 'firebase-admin/app';
import path from 'path';

// This file is for server-side Firebase operations.
// It initializes the Firebase Admin SDK.

type FirebaseAdmin = {
    app: App | null;
    db: admin.firestore.Firestore | null;
    storage: admin.storage.Storage | null;
    adminAuth: admin.auth.Auth | null;
    initError: string | null;
    clientEmail: string | null;
}

function initializeFirebaseAdmin(): FirebaseAdmin {
  // Explicitly load environment variables from the project root .env file
  // This is for local development and ensures the server has credentials.
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey || serviceAccountKey === 'PASTE_YOUR_NEW_SERVICE_ACCOUNT_KEY_JSON_HERE') {
    const errorMsg = "SETUP REQUIRED: The FIREBASE_SERVICE_ACCOUNT_KEY is missing. Please open the `.env` file in your project root and paste your new service account JSON credentials into it. The server cannot connect to the database without it.";
    console.error(errorMsg);
    return { app: null, db: null, storage: null, adminAuth: null, initError: errorMsg, clientEmail: null };
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    const errorMsg = 'The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not a valid JSON string. Please ensure you have copied the entire JSON object from your service account file.';
    return { app: null, db: null, storage: null, adminAuth: null, initError: errorMsg, clientEmail: null };
  }

  const email = serviceAccount.client_email;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  // If the app is already initialized, return the existing instance.
  // This is common in development with hot-reloading.
  if (admin.apps.length > 0) {
    const app = admin.app();
    return {
        app,
        db: getFirestore(app),
        storage: getStorage(app),
        adminAuth: app.auth(),
        initError: null,
        clientEmail: email,
    };
  }

  // Otherwise, initialize a new app instance.
  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
    return {
        app,
        db: getFirestore(app),
        storage: getStorage(app),
        adminAuth: app.auth(),
        initError: null,
        clientEmail: email,
    };
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    const errorMsg = `Firebase Admin SDK initialization failed: ${error.message}`;
    return { app: null, db: null, storage: null, adminAuth: null, initError: errorMsg, clientEmail: email };
  }
}

const { app, db, storage, adminAuth, initError, clientEmail } = initializeFirebaseAdmin();
export { db, storage, adminAuth, initError, clientEmail };
