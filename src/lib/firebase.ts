import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPQdm_dtkfcyBAE42bv5GLmHRFJVTWC78",
  authDomain: "dheerendra-591e7.firebaseapp.com",
  projectId: "dheerendra-591e7",
  storageBucket: "dheerendra-591e7.appspot.com",
  messagingSenderId: "306410417000",
  appId: "1:306410417000:web:d72dfb3ca5ec4c45a604dd",
  measurementId: "G-Z3Y6E61HNM"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);

export { app, auth };
