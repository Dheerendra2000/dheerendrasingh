import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (firebaseConfig.apiKey) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} else {
  // This message will be visible in the server logs and browser console.
  console.error(`
  ********************************************************************************
  * FIREBASE CONFIGURATION ERROR                                                 *
  *                                                                              *
  * Your Firebase API key is missing from the environment variables.             *
  * Authentication will not work.                                                *
  *                                                                              *
  * Please create a .env.local file in the root of your project and add your     *
  * Firebase credentials. You can find these in your Firebase project console.   *
  *                                                                              *
  * Example .env.local:                                                          *
  * NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"                                  *
  * NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"                          *
  * ...and so on for all the required keys.                                      *
  ********************************************************************************
  `);
}

export { app, auth };
